import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  CheckCircle2,
  User,
  ExternalLink,
  Loader2,
} from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <DiagnosticBanner />

      <main className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-blue-600" />
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Welcome to Rotection
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Choose your preferred sign-in method
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign In Options</CardTitle>
              <CardDescription>
                Select your preferred authentication method to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 transition-colors"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>

              <Button
                onClick={handleRobloxSignIn}
                disabled={isLoading}
                className="w-full bg-[#00A2FF] hover:bg-[#0084CC] text-white transition-colors"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <User className="h-4 w-4 mr-2" />
                )}
                Continue with Roblox
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <a href="/tos" className="underline hover:text-gray-700">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/pp" className="underline hover:text-gray-700">
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
            <DialogTitle className="flex items-center gap-2">
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
                className={usernameError ? "border-red-500" : ""}
              />
              {usernameError && (
                <p className="text-sm text-red-600">{usernameError}</p>
              )}
              <p className="text-xs text-gray-500">
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
