import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowRight, CheckCircle2, Mail, User, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

type AuthMode = "login" | "register";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  username: z.string().trim().min(3, { message: "Username must be at least 3 characters" }).max(20, { message: "Username must be less than 20 characters" }),
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    setErrors({});
    
    try {
      if (mode === "register") {
        registerSchema.parse({ username, email, password });
      } else {
        loginSchema.parse({ email, password });
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { username?: string; email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              username: username.trim(),
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Please log in instead.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else {
          toast({
            title: "Account created!",
            description: "Welcome to Rotection! You are now logged in.",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Login failed",
              description: "Invalid email or password. Please try again.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="py-20 px-4">
        <div className="container max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-6">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold text-primary mb-2">
              {mode === "login" ? "Welcome Back" : "Join Rotection"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "login" 
                ? "Log in to your account to continue" 
                : "Create your account to get started"
              }
            </p>
          </div>

          {/* Auth Card */}
          <div 
            className="bg-card rounded-2xl border border-border p-8 shadow-lg animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "register" && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`h-12 pl-10 ${errors.username ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-sm text-destructive mt-1">{errors.username}</p>
                  )}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`h-12 pl-10 ${errors.email ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`h-12 pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password}</p>
                )}
              </div>

              <Button 
                type="submit"
                className="w-full h-12 rounded-full text-base font-bold gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {mode === "login" ? "Logging in..." : "Creating account..."}
                  </>
                ) : (
                  <>
                    {mode === "login" ? "Log In" : "Create Account"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Mode Toggle */}
            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-muted-foreground">
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setErrors({});
                  }}
                  className="ml-2 text-primary font-medium hover:underline"
                >
                  {mode === "login" ? "Sign up" : "Log in"}
                </button>
              </p>
            </div>
          </div>

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

      <Footer />
    </div>
  );
};

export default Auth;
