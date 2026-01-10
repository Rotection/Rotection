import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const RobloxCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { linkRobloxAccount, user } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          throw new Error(errorDescription || `OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // 🔧 FIX: safe localStorage access
        let storedState: string | null = null;
        try {
          storedState = localStorage.getItem('roblox_oauth_state');
          localStorage.removeItem('roblox_oauth_state');
        } catch {
          throw new Error('Unable to access local authentication state');
        }

        if (!storedState || storedState !== state) {
          throw new Error('Invalid state parameter. Possible CSRF attack.');
        }

        if (!user) {
          throw new Error('No authenticated user found. Please sign in first.');
        }

        await linkRobloxAccount(code);

        setStatus('success');

        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);

      } catch (error: any) {
        console.error('Roblox OAuth callback error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'An unexpected error occurred');

        toast({
          title: 'Authentication Error',
          description: error.message || 'Failed to complete Roblox authentication',
          variant: 'destructive',
        });
      }
    };

    handleCallback();
  }, [searchParams, linkRobloxAccount, user, navigate]);

  const handleRetry = () => {
    navigate('/auth', { replace: true });
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === 'processing' && (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                Processing Authentication
              </>
            )}
            {status === 'success' && (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                Authentication Successful
              </>
            )}
            {status === 'error' && (
              <>
                <AlertCircle className="h-6 w-6 text-red-600" />
                Authentication Failed
              </>
            )}
          </CardTitle>
          <CardDescription>
            {status === 'processing' && 'Completing your Roblox authentication...'}
            {status === 'success' && 'Your Roblox account has been successfully linked!'}
            {status === 'error' && 'There was a problem with your authentication.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === 'processing' && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
            </div>
          )}

          {status === 'success' && (
            <Button onClick={handleGoHome} className="w-full">
              Go to Home Page
            </Button>
          )}

          {status === 'error' && (
            <>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>

              <Button onClick={handleRetry} variant="outline" className="w-full">
                Try Again
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RobloxCallback;
