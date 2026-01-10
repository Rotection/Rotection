import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function DiagnosticBanner() {
  const [diagnostics, setDiagnostics] = useState<{
    envVars: boolean;
    supabaseConnected: boolean;
    dbError: string | null;
  }>({
    envVars: false,
    supabaseConnected: false,
    dbError: null,
  });

  useEffect(() => {
    const checkDiagnostics = async () => {
      // Check env vars
      const hasEnvVars = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
      
      // Check Supabase connection
      let supabaseConnected = false;
      let dbError: string | null = null;
      
      try {
        const { error } = await supabase.from('profiles').select('id').limit(1);
        supabaseConnected = !error;
        if (error) {
          dbError = error.message;
          console.error('[DIAGNOSTIC] Database error:', error);
        }
      } catch (e) {
        dbError = e instanceof Error ? e.message : 'Unknown error';
        console.error('[DIAGNOSTIC] Connection error:', e);
      }

      setDiagnostics({
        envVars: hasEnvVars,
        supabaseConnected,
        dbError,
      });
    };

    checkDiagnostics();
  }, []);

  const hasIssues = !diagnostics.envVars || !diagnostics.supabaseConnected;

  if (!hasIssues) return null;

  return (
    <Alert variant={hasIssues ? "destructive" : "default"} className="m-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Diagnostic Information</AlertTitle>
      <AlertDescription className="space-y-2">
        <div>
          <strong>Environment Variables:</strong> {diagnostics.envVars ? (
            <span className="text-green-600">✓ Configured</span>
          ) : (
            <span className="text-red-600">✗ Missing</span>
          )}
        </div>
        <div>
          <strong>Database Connection:</strong> {diagnostics.supabaseConnected ? (
            <span className="text-green-600">✓ Connected</span>
          ) : (
            <span className="text-red-600">✗ Failed</span>
          )}
        </div>
        {diagnostics.dbError && (
          <div className="text-sm mt-2">
            <strong>Error:</strong> {diagnostics.dbError}
          </div>
        )}
        {!diagnostics.supabaseConnected && (
          <div className="text-sm mt-2 text-muted-foreground">
            Make sure you've applied the database migrations. Run <code className="bg-muted px-1 rounded">apply-all-fixes.sql</code> in your Supabase SQL Editor.
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
