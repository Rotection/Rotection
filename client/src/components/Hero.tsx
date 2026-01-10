import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="relative container max-w-4xl mx-auto text-center">
        {/* Shield Icon */}
        <div 
          className="inline-flex items-center justify-center p-6 rounded-full bg-primary/10 mb-8 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <Shield className="w-16 h-16 text-primary animate-float" />
        </div>

        {/* Tagline */}
        <h1 
          className="text-primary text-lg md:text-xl font-bold mb-6 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          Play Safe. Play Fun. Play Verified.
        </h1>

        {/* Description */}
        <p 
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          Rotection helps you find safe and honest Roblox games. We check games for 
          safety, fairness, and age-appropriateness so you can play with confidence!
        </p>

        {/* CTA Button */}
        <div 
          className="animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <Link to="/games">
            <Button 
              size="lg" 
              className="rounded-full px-8 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Find Safe Games Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
