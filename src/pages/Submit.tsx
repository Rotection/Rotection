import { useState } from "react";
import { Shield, Upload, Link as LinkIcon, Image, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const ageRatings = ["5+", "7+", "9+", "13+", "17+"];
const genres = [
  "Action RPG",
  "Adventure",
  "Fighting",
  "Horror",
  "Obby",
  "Party & Casual",
  "Racing",
  "Roleplay",
  "Sandbox",
  "Shooter",
  "Simulator",
  "Sports",
  "Strategy",
  "Survival",
  "Tycoon",
];

const Submit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    gameLink: "",
    gameName: "",
    developerName: "",
    description: "",
    ageRating: "",
    genre: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.gameLink || !formData.gameName || !formData.ageRating || !formData.genre) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await GameService.submitGame(
        formData.gameLink
      );

      if (result.success) {
        setSubmitted(true);
        toast({
          title: "Game Submitted!",
          description: result.message,
        });
      } else {
        toast({
          title: "Submission Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="py-20 px-4">
        <div className="container max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-6">
              <Upload className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold text-primary mb-2">
              Submit Your Game
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Get your game verified by Rotection and earn the trusted safety badge
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div 
                className="bg-card rounded-2xl border border-border p-8 shadow-lg space-y-6 animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                {/* Developer Verification Notice */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">Developer Verification Required</p>
                    <p className="text-muted-foreground">
                      Make sure you're logged in with your verified Roblox developer account before submitting.
                    </p>
                  </div>
                </div>

                {/* Game Link */}
                <div className="space-y-2">
                  <Label htmlFor="gameLink" className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Roblox Game Link *
                  </Label>
                  <Input
                    id="gameLink"
                    placeholder="https://www.roblox.com/games/..."
                    value={formData.gameLink}
                    onChange={(e) => setFormData({ ...formData, gameLink: e.target.value })}
                    className="h-12"
                  />
                </div>

                {/* Game Name */}
                <div className="space-y-2">
                  <Label htmlFor="gameName">Game Name *</Label>
                  <Input
                    id="gameName"
                    placeholder="Enter your game's name"
                    value={formData.gameName}
                    onChange={(e) => setFormData({ ...formData, gameName: e.target.value })}
                    className="h-12"
                  />
                </div>

                {/* Developer Name */}
                <div className="space-y-2">
                  <Label htmlFor="developerName">Developer / Studio Name</Label>
                  <Input
                    id="developerName"
                    placeholder="Your name or studio name"
                    value={formData.developerName}
                    onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
                    className="h-12"
                  />
                </div>

                {/* Age Rating & Genre */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Recommended Age Rating *</Label>
                    <Select 
                      value={formData.ageRating} 
                      onValueChange={(value) => setFormData({ ...formData, ageRating: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select age rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageRatings.map((age) => (
                          <SelectItem key={age} value={age}>{age}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Genre *</Label>
                    <Select 
                      value={formData.genre} 
                      onValueChange={(value) => setFormData({ ...formData, genre: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your game and any safety features you've implemented..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                {/* Screenshots Notice */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
                  <Image className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">Screenshots Auto-Imported</p>
                    <p className="text-muted-foreground">
                      We'll automatically import your game's thumbnail and screenshots from Roblox.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  className="w-full h-12 rounded-full text-base font-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Submit for Verification
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            /* Success State */
            <div 
              className="bg-card rounded-2xl border border-border p-8 shadow-lg text-center animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-safety-high-bg mb-6">
                <CheckCircle2 className="w-8 h-8 text-safety-high" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Submission Received!
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Your game <strong className="text-primary">{formData.gameName}</strong> has been submitted 
                for review. Our team will verify it and you'll receive a notification once it's approved.
              </p>
              <div className="space-y-3">
                <Button className="w-full rounded-full" asChild>
                  <a href="/games">Browse Games</a>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full rounded-full"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      gameLink: "",
                      gameName: "",
                      developerName: "",
                      description: "",
                      ageRating: "",
                      genre: "",
                    });
                  }}
                >
                  Submit Another Game
                </Button>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div 
            className="mt-8 space-y-4 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-lg font-bold text-foreground text-center">What happens next?</h3>
            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">1</div>
                <div>
                  <h4 className="font-medium text-foreground">We review your game</h4>
                  <p className="text-sm text-muted-foreground">Our moderators check for safety and age-appropriateness</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">2</div>
                <div>
                  <h4 className="font-medium text-foreground">Community ratings begin</h4>
                  <p className="text-sm text-muted-foreground">Players can rate your game on honesty, safety, fairness</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">3</div>
                <div>
                  <h4 className="font-medium text-foreground">Earn the Verified badge</h4>
                  <p className="text-sm text-muted-foreground">Games meeting our standards get the Rotection Verified badge</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Submit;
