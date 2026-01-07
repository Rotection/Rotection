import { useState } from 'react';
import { User, Link, Unlink, Loader2, Shield, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const AccountSettings = () => {
  const {
    user,
    profile,
    signInWithGoogle,
    signInWithRoblox,
    unlinkRobloxAccount,
    signOut,
  } = useAuthContext();
  const [loading, setLoading] = useState<string | null>(null);

  const handleLinkGoogle = async () => {
    if (user?.app_metadata?.provider === 'google') {
      toast({
        title: 'Already Linked',
        description: 'Your account is already using Google authentication.',
      });
      return;
    }

    setLoading('google');
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Failed to link Google account:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleLinkRoblox = async () => {
    setLoading('roblox');
    try {
      await signInWithRoblox();
    } catch (error) {
      console.error('Failed to link Roblox account:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleUnlinkRoblox = async () => {
    setLoading('unlink-roblox');
    try {
      await unlinkRobloxAccount();
      toast({
        title: 'Account Unlinked',
        description: 'Your Roblox account has been successfully unlinked.',
      });
    } catch (error) {
      console.error('Failed to unlink Roblox account:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleSignOut = async () => {
    setLoading('signout');
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    } finally {
      setLoading(null);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Please sign in to manage your account settings.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isGoogleLinked = user.app_metadata?.provider === 'google';
  const isRobloxLinked = Boolean(profile?.roblox_user_id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Overview
          </CardTitle>
          <CardDescription>
            Manage your account settings and linked services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Username</p>
              <p className="text-sm text-muted-foreground">
                {profile?.username || 'Not set'}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">
                {user.email || 'Not available'}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">User ID</p>
              <p className="text-sm text-muted-foreground font-mono">
                {user.id}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Linked Accounts
          </CardTitle>
          <CardDescription>
            Connect your accounts to enhance your Rotection experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Account */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-white border rounded-full">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Google Account</p>
                <p className="text-xs text-muted-foreground">
                  {isGoogleLinked
                    ? `Connected as ${user.email}`
                    : 'Sign in with Google for easy access'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isGoogleLinked ? (
                <>
                  <Badge variant="secondary" className="text-green-600">
                    <Shield className="w-3 h-3 mr-1" />
                    Primary
                  </Badge>
                </>
              ) : (
                <Button
                  onClick={handleLinkGoogle}
                  disabled={loading === 'google'}
                  size="sm"
                  variant="outline"
                >
                  {loading === 'google' ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Linking...
                    </>
                  ) : (
                    <>
                      <Link className="w-3 h-3 mr-1" />
                      Link
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Roblox Account */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-[#00A2FF] rounded-full">
                <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                  <path d="M5.164 0L.16 18.928 18.836 24l5.004-18.928L5.164 0zm9.086 15.744l-5.996-1.58 1.58-5.996 5.996 1.58-1.58 5.996z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Roblox Account</p>
                <p className="text-xs text-muted-foreground">
                  {isRobloxLinked
                    ? `Connected as ${profile?.roblox_username}`
                    : 'Connect your Roblox account'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isRobloxLinked ? (
                <>
                  <Badge variant="secondary" className="text-blue-600">
                    <Shield className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                  <Button
                    onClick={handleUnlinkRoblox}
                    disabled={loading === 'unlink-roblox'}
                    size="sm"
                    variant="outline"
                  >
                    {loading === 'unlink-roblox' ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Unlinking...
                      </>
                    ) : (
                      <>
                        <Unlink className="w-3 h-3 mr-1" />
                        Unlink
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleLinkRoblox}
                  disabled={loading === 'roblox'}
                  size="sm"
                  variant="outline"
                >
                  {loading === 'roblox' ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Linking...
                    </>
                  ) : (
                    <>
                      <Link className="w-3 h-3 mr-1" />
                      Link
                      <ExternalLink className="w-2 h-2 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {isRobloxLinked && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your Roblox account ({profile?.roblox_username}) is securely
                linked. You can use it to verify game ownership and access
                developer features.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <p className="text-sm font-medium text-red-800">Sign Out</p>
              <p className="text-xs text-red-600">
                Sign out of your account on this device
              </p>
            </div>
            <Button
              onClick={handleSignOut}
              disabled={loading === 'signout'}
              variant="destructive"
              size="sm"
            >
              {loading === 'signout' ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Signing Out...
                </>
              ) : (
                'Sign Out'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
