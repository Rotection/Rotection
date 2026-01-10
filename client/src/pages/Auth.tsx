import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, User, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DiagnosticBanner } from "@/components/DiagnosticBanner";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthStep = "choose" | "username-setup";

const usernameSchema = z
  .string()
  .trim()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(20, { message: "Username must be less than 20 characters" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  });

const Auth = () => {
  const navigate = useNavigate();
  const {
    user,
    loading,
    profile,
    signInWithGoogle,
    signInWithRoblox,
    updateProfile,
  } = useAuth();
  const [step, setStep] = useState<AuthStep>("choose");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [showUsernameDialog, setShowUsernameDialog] = useState(false);

  useEffect(() => {
    // If user is authenticated and has a username, redirect to home
    if (user && profile?.username) {
      navigate("/");
      return;
    }

    // If user is authenticated but doesn't have a username, show username setup
    if (user && !profile?.username) {
      setShowUsernameDialog(true);
    }
  }, [user, profile, navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleRobloxSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithRoblox();
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleUsernameSubmit = async () => {
    setUsernameError("");

    try {
      usernameSchema.parse(username);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setUsernameError(error.errors[0]?.message || "Invalid username");
      }
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({ username: username.trim() });
      setShowUsernameDialog(false);
      toast({
        title: "Profile Updated",
        description: "Your username has been set successfully!",
      });
      navigate("/");
    } catch (error: any) {
      const errorMessage = error.message?.toLowerCase() || "";
      if (
        errorMessage.includes("username") &&
        (errorMessage.includes("unique") ||
          errorMessage.includes("duplicate") ||
          errorMessage.includes("already exists"))
      ) {
        setUsernameError(
          "This username is already taken. Please choose another.",
        );
      } else {
        setUsernameError("Failed to set username. Please try again.");
      }
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <DiagnosticBanner />

      <main className="flex-1 py-20 px-4">
        {/* Background gradient matching Hero section */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="relative container max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center p-6 rounded-full bg-primary/10 mb-8">
              <Shield className="w-12 h-12 text-primary animate-float" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Welcome to Rotection
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Choose your preferred sign-in method to get started
            </p>
          </div>

          {/* Auth Card */}
          <Card
            className="animate-fade-in shadow-lg border-primary/10"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold text-foreground">
                Sign In Options
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Select your preferred authentication method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Sign In */}
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-card text-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-105 shadow-sm"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-3" />
                ) : (
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC04"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>

              {/* Roblox Sign In */}
              <Button
                onClick={handleRobloxSignIn}
                disabled={isLoading}
                className="w-full bg-[#00A2FF] hover:bg-[#0084CC] text-white transition-all duration-300 hover:scale-105 shadow-sm"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-3" />
                ) : (
                  <User className="h-5 w-5 mr-3" />
                )}
                Continue with Roblox
                <ExternalLink className="h-3 w-3 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Terms and Privacy */}
          <div
            className="text-center mt-8 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <p className="text-xs text-muted-foreground leading-relaxed">
              By signing in, you agree to our{" "}
              <a
                href="/tos"
                className="text-primary hover:text-primary/80 underline transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/pp"
                className="text-primary hover:text-primary/80 underline transition-colors"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Username Setup Dialog */}
      <Dialog open={showUsernameDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <User className="h-5 w-5" />
              Set Your Username
            </DialogTitle>
            <DialogDescription>
              Please choose a username to complete your account setup.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Enter username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError("");
                }}
                disabled={isLoading}
                className={
                  usernameError
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {usernameError && (
                <p className="text-sm text-destructive">{usernameError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Username must be 3-20 characters and can only contain letters,
                numbers, and underscores.
              </p>
            </div>

            <Button
              onClick={handleUsernameSubmit}
              disabled={!username.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Setting Username...
                </>
              ) : (
                "Set Username"
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
