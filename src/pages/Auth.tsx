import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, CheckCircle2, User, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AuthStep = "choose" | "roblox-username" | "roblox-verify" | "google-username";

const usernameSchema = z.string().trim()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(20, { message: "Username must be less than 20 characters" })
  .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" });

const VERIFICATION_PHRASE = "I am verifying my Rotection account";

const Auth = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<AuthStep>("choose");
  const [robloxUsername, setRobloxUsername] = useState("");
  const [robloxDisplayName, setRobloxDisplayName] = useState("");
  const [robloxUserId, setRobloxUserId] = useState("");
  const [googleUsername, setGoogleUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [showUsernameDialog, setShowUsernameDialog] = useState(false);
  const [pendingGoogleSession, setPendingGoogleSession] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Check if this is a Google sign-in that needs a username
        const provider = session.user.app_metadata?.provider;
        if (provider === 'google') {
          // Check if user already has a profile
          setTimeout(async () => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username')
              .eq('user_id', session.user.id)
              .single();
            
            if (!profile?.username) {
              setPendingGoogleSession(session);
              setShowUsernameDialog(true);
            } else {
              navigate("/");
            }
          }, 0);
        } else {
          navigate("/");
        }
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const provider = session.user.app_metadata?.provider;
        if (provider === 'google') {
          setTimeout(async () => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username')
              .eq('user_id', session.user.id)
              .single();
            
            if (!profile?.username) {
              setPendingGoogleSession(session);
              setShowUsernameDialog(true);
            } else {
              navigate("/");
            }
          }, 0);
        } else {
          navigate("/");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleGoogleUsernameSubmit = async () => {
    setUsernameError("");
    
    try {
      usernameSchema.parse(googleUsername);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setUsernameError(error.errors[0]?.message || "Invalid username");
      }
      return;
    }

    setIsLoading(true);
    try {
      // Update the profile with the chosen username
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: pendingGoogleSession.user.id,
          username: googleUsername.trim(),
        });

      if (error) {
        if (error.message.includes('duplicate') || error.message.includes('unique')) {
          setUsernameError("This username is already taken");
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Welcome to Rotection!",
        description: "Your account has been created.",
      });
      setShowUsernameDialog(false);
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to set username. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRobloxUsernameSubmit = async () => {
    setUsernameError("");
    
    if (!robloxUsername.trim()) {
      setUsernameError("Please enter your Roblox username");
      return;
    }

    setIsLoading(true);
    try {
      // Fetch Roblox user info using the public API
      const response = await fetch(
        `https://users.roblox.com/v1/usernames/users`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usernames: [robloxUsername.trim()],
            excludeBannedUsers: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Roblox user");
      }

      const data = await response.json();
      
      if (!data.data || data.data.length === 0) {
        setUsernameError("Roblox user not found. Please check the username.");
        return;
      }

      const user = data.data[0];
      setRobloxUserId(user.id.toString());
      setRobloxDisplayName(user.displayName);
      setStep("roblox-verify");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to look up Roblox user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRobloxVerify = async () => {
    setIsLoading(true);
    try {
      // Fetch user's profile to check for verification phrase
      const response = await fetch(
        `https://users.roblox.com/v1/users/${robloxUserId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Roblox profile");
      }

      const userData = await response.json();
      const description = userData.description || "";

      if (!description.includes(VERIFICATION_PHRASE)) {
        toast({
          title: "Verification failed",
          description: "Could not find the verification phrase in your Roblox profile. Make sure to add it to your 'About' section.",
          variant: "destructive",
        });
        return;
      }

      // Verification successful - create account with anonymous auth + metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `${robloxUserId}@roblox.rotection.local`,
        password: crypto.randomUUID(),
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username: robloxDisplayName,
            roblox_user_id: robloxUserId,
            roblox_username: robloxUsername,
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          // User already exists, try to sign in
          toast({
            title: "Account exists",
            description: "This Roblox account is already linked. Please contact support if you need help.",
            variant: "destructive",
          });
        } else {
          throw authError;
        }
        return;
      }

      toast({
        title: "Welcome to Rotection!",
        description: `Signed in as ${robloxDisplayName}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to complete verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderChooseMethod = () => (
    <>
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-6">
          <Shield className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold text-primary mb-2">
          Join Rotection
        </h1>
        <p className="text-muted-foreground">
          Choose how you want to sign in
        </p>
      </div>

      <div 
        className="bg-card rounded-2xl border border-border p-8 shadow-lg animate-fade-in space-y-4"
        style={{ animationDelay: "0.1s" }}
      >
        {/* Roblox Verification */}
        <Button
          onClick={() => setStep("roblox-username")}
          className="w-full h-14 rounded-xl text-base font-bold gap-3 bg-[#00A2FF] hover:bg-[#0090E0] text-white"
          disabled={isLoading}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M5.164 0L.16 18.928 18.836 24l5.004-18.928L5.164 0zm9.086 15.744l-5.996-1.58 1.58-5.996 5.996 1.58-1.58 5.996z" />
          </svg>
          Continue with Roblox
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>

        {/* Google OAuth */}
        <Button
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full h-14 rounded-xl text-base font-bold gap-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Continue with Google
        </Button>
      </div>
    </>
  );

  const renderRobloxUsername = () => (
    <>
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-[#00A2FF]/10 mb-6">
          <svg viewBox="0 0 24 24" className="w-12 h-12" fill="#00A2FF">
            <path d="M5.164 0L.16 18.928 18.836 24l5.004-18.928L5.164 0zm9.086 15.744l-5.996-1.58 1.58-5.996 5.996 1.58-1.58 5.996z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-primary mb-2">
          Connect Roblox
        </h1>
        <p className="text-muted-foreground">
          Enter your Roblox username to get started
        </p>
      </div>

      <div 
        className="bg-card rounded-2xl border border-border p-8 shadow-lg animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Roblox Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Enter your Roblox username"
                value={robloxUsername}
                onChange={(e) => setRobloxUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRobloxUsernameSubmit()}
                className={`h-12 pl-10 ${usernameError ? "border-destructive" : ""}`}
              />
            </div>
            {usernameError && (
              <p className="text-sm text-destructive mt-1">{usernameError}</p>
            )}
          </div>

          <Button
            onClick={handleRobloxUsernameSubmit}
            className="w-full h-12 rounded-full text-base font-bold gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Looking up user...
              </>
            ) : (
              "Continue"
            )}
          </Button>

          <Button
            onClick={() => {
              setStep("choose");
              setUsernameError("");
              setRobloxUsername("");
            }}
            variant="ghost"
            className="w-full"
          >
            Back
          </Button>
        </div>
      </div>
    </>
  );

  const renderRobloxVerify = () => (
    <>
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-[#00A2FF]/10 mb-6">
          <svg viewBox="0 0 24 24" className="w-12 h-12" fill="#00A2FF">
            <path d="M5.164 0L.16 18.928 18.836 24l5.004-18.928L5.164 0zm9.086 15.744l-5.996-1.58 1.58-5.996 5.996 1.58-1.58 5.996z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-primary mb-2">
          Verify Your Account
        </h1>
        <p className="text-muted-foreground">
          Welcome, <span className="font-semibold text-foreground">{robloxDisplayName}</span>
        </p>
      </div>

      <div 
        className="bg-card rounded-2xl border border-border p-8 shadow-lg animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              To verify you own this Roblox account, add the following phrase to your Roblox profile's <strong>"About"</strong> section:
            </p>
            
            <div className="bg-muted rounded-lg p-4 font-mono text-sm text-foreground break-all select-all cursor-pointer border border-border">
              {VERIFICATION_PHRASE}
            </div>

            <p className="text-xs text-muted-foreground">
              Click the text above to select it, then copy and paste it into your Roblox profile.
            </p>
          </div>

          <Button
            onClick={() => window.open(`https://www.roblox.com/users/${robloxUserId}/profile`, '_blank')}
            variant="outline"
            className="w-full h-12 rounded-xl gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open Roblox Profile
          </Button>

          <Button
            onClick={handleRobloxVerify}
            className="w-full h-12 rounded-full text-base font-bold gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                I've Added the Phrase
              </>
            )}
          </Button>

          <Button
            onClick={() => {
              setStep("roblox-username");
              setRobloxDisplayName("");
              setRobloxUserId("");
            }}
            variant="ghost"
            className="w-full"
          >
            Use Different Account
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="py-20 px-4">
        <div className="container max-w-md mx-auto">
          {step === "choose" && renderChooseMethod()}
          {step === "roblox-username" && renderRobloxUsername()}
          {step === "roblox-verify" && renderRobloxVerify()}

          {/* Info Cards */}
          <div 
            className="mt-8 grid gap-4 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Rate and review games</h4>
                <p className="text-sm text-muted-foreground">Share your experience to help others</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Submit games as a developer</h4>
                <p className="text-sm text-muted-foreground">Get verified and earn the Rotection badge</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Report issues</h4>
                <p className="text-sm text-muted-foreground">Help keep the community safe</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Google Username Dialog */}
      <Dialog open={showUsernameDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Choose your username</DialogTitle>
            <DialogDescription>
              Pick a username for your Rotection account. This will be visible to other users.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Choose a username"
                  value={googleUsername}
                  onChange={(e) => setGoogleUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGoogleUsernameSubmit()}
                  className={`h-12 pl-10 ${usernameError ? "border-destructive" : ""}`}
                />
              </div>
              {usernameError && (
                <p className="text-sm text-destructive mt-1">{usernameError}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                3-20 characters, letters, numbers, and underscores only
              </p>
            </div>
            <Button
              onClick={handleGoogleUsernameSubmit}
              className="w-full h-12 rounded-full text-base font-bold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Auth;
