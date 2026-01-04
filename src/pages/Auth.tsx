import { useState } from "react";
import { Shield, Gamepad2, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

type AuthMode = "login" | "register";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [robloxUsername, setRobloxUsername] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleRobloxConnect = async () => {
    if (!robloxUsername.trim()) {
      toast({
        title: "Username required",
        description: "Please enter your Roblox username",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    // Simulate verification process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      toast({
        title: "Account Connected!",
        description: `Welcome, ${robloxUsername}! Your Roblox account has been verified.`,
      });
    }, 2000);
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
                ? "Connect your Roblox account to continue" 
                : "Create your account by connecting your Roblox profile"
              }
            </p>
          </div>

          {/* Auth Card */}
          <div 
            className="bg-card rounded-2xl border border-border p-8 shadow-lg animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            {!isConnected ? (
              <>
                {/* Roblox Connection */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
                    <Gamepad2 className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-bold text-foreground">Connect with Roblox</h3>
                      <p className="text-sm text-muted-foreground">
                        We verify your account similar to RoVer
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Roblox Username
                      </label>
                      <Input
                        placeholder="Enter your Roblox username"
                        value={robloxUsername}
                        onChange={(e) => setRobloxUsername(e.target.value)}
                        className="h-12"
                      />
                    </div>

                    <Button 
                      className="w-full h-12 rounded-full text-base font-bold gap-2"
                      onClick={handleRobloxConnect}
                      disabled={isConnecting}
                    >
                      {isConnecting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Connect Account
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>
                      By connecting, you agree to our verification process that confirms 
                      you own this Roblox account.
                    </p>
                  </div>
                </div>

                {/* Mode Toggle */}
                <div className="mt-8 pt-6 border-t border-border text-center">
                  <p className="text-muted-foreground">
                    {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                    <button
                      onClick={() => setMode(mode === "login" ? "register" : "login")}
                      className="ml-2 text-primary font-medium hover:underline"
                    >
                      {mode === "login" ? "Sign up" : "Log in"}
                    </button>
                  </p>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-safety-high-bg mb-6">
                  <CheckCircle2 className="w-8 h-8 text-safety-high" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Successfully Connected!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Your Roblox account <strong className="text-primary">{robloxUsername}</strong> is now linked.
                </p>
                <div className="space-y-3">
                  <Button className="w-full rounded-full" asChild>
                    <a href="/games">Browse Games</a>
                  </Button>
                  <Button variant="outline" className="w-full rounded-full gap-2" asChild>
                    <a href="/submit">
                      Submit a Game
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            )}
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
