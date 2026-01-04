import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Shield, Star, Users, Calendar, ExternalLink, Flag, 
  ThumbsUp, ThumbsDown, MessageSquare, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Sample game data
const gameData = {
  id: "101411193179895",
  title: "[ METALLIX ] Speedsters Sandbox",
  developer: "Speedsters Sandbox",
  imageUrl: "https://tr.rbxcdn.com/180DAY-bf6e00c4f61b35b36ea92d828e4c3232/768/432/Image/Webp/noFilter",
  safetyScore: 90,
  rating: 4.5,
  ratingCount: 12,
  ageRating: "5+",
  genre: "Sandbox",
  verified: true,
  description: "An amazing sandbox game where you can become a speedster and explore a vast world with other players.",
  robloxLink: "https://www.roblox.com/games/101411193179895",
  ratings: {
    honesty: 4.5,
    safety: 4.8,
    fairness: 4.2,
    ageAppropriate: 4.7,
  },
  reviews: [
    {
      id: "1",
      author: "Player123",
      rating: 5,
      content: "Great game! Very safe and fun for kids. Highly recommend!",
      date: "2024-12-15",
      helpful: 24,
      unhelpful: 2,
    },
    {
      id: "2",
      author: "GamerMom",
      rating: 4,
      content: "My kids love this game. No concerns about safety or inappropriate content.",
      date: "2024-12-10",
      helpful: 18,
      unhelpful: 1,
    },
  ],
};

const GameDetail = () => {
  const { id } = useParams();
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [userRatings, setUserRatings] = useState({
    honesty: 0,
    safety: 0,
    fairness: 0,
    ageAppropriate: 0,
  });
  const [reviewText, setReviewText] = useState("");

  const getSafetyColor = (score: number) => {
    if (score >= 80) return "text-safety-high bg-safety-high-bg";
    if (score >= 60) return "text-safety-medium bg-safety-medium-bg";
    return "text-safety-low bg-safety-low-bg";
  };

  const handleSubmitRating = () => {
    if (Object.values(userRatings).some(r => r === 0)) {
      toast({
        title: "Incomplete rating",
        description: "Please rate all categories",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Rating Submitted!",
      description: "Thank you for helping the community!",
    });
    setShowRatingDialog(false);
  };

  const handleSubmitReport = () => {
    toast({
      title: "Report Submitted",
      description: "Our moderators will review your report shortly.",
    });
    setShowReportDialog(false);
  };

  const StarRating = ({ 
    value, 
    onChange, 
    readonly = false 
  }: { 
    value: number; 
    onChange?: (v: number) => void; 
    readonly?: boolean;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <Star 
            className={`w-5 h-5 ${star <= value ? 'text-star fill-star' : 'text-muted-foreground'}`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 animate-fade-in">
            <Link to="/games" className="hover:text-primary transition-colors">Games</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{gameData.title}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Image */}
              <div className="relative rounded-2xl overflow-hidden animate-fade-in">
                <img
                  src={gameData.imageUrl}
                  alt={gameData.title}
                  className="w-full aspect-video object-cover"
                />
                {gameData.verified && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full flex items-center gap-2 font-medium">
                    <Shield className="w-5 h-5" />
                    Verified Safe
                  </div>
                )}
              </div>

              {/* Title & Info */}
              <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <h1 className="text-3xl font-extrabold text-primary mb-2">
                  {gameData.title}
                </h1>
                <p className="text-muted-foreground text-lg mb-4">
                  by {gameData.developer}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className={`px-4 py-2 rounded-full font-medium ${getSafetyColor(gameData.safetyScore)}`}>
                    Safety Score: {gameData.safetyScore}%
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Star className="w-5 h-5 text-star fill-star" />
                    <span className="font-medium text-foreground">{gameData.rating.toFixed(1)}</span>
                    <span>({gameData.ratingCount} ratings)</span>
                  </div>
                  <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full font-medium">
                    {gameData.ageRating}
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    {gameData.genre}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div 
                className="bg-card rounded-2xl border border-border p-6 animate-fade-in"
                style={{ animationDelay: "0.15s" }}
              >
                <h2 className="text-xl font-bold text-foreground mb-4">About This Game</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {gameData.description}
                </p>
              </div>

              {/* Category Ratings */}
              <div 
                className="bg-card rounded-2xl border border-border p-6 animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <h2 className="text-xl font-bold text-foreground mb-6">Safety Ratings</h2>
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(gameData.ratings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className="flex items-center gap-2">
                        <StarRating value={Math.round(value)} readonly />
                        <span className="text-foreground font-medium">{value.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div 
                className="bg-card rounded-2xl border border-border p-6 animate-fade-in"
                style={{ animationDelay: "0.25s" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Player Reviews</h2>
                  <span className="text-muted-foreground">{gameData.reviews.length} reviews</span>
                </div>
                
                <div className="space-y-6">
                  {gameData.reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-foreground">{review.author}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating value={review.rating} readonly />
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">{review.content}</p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          Helpful ({review.helpful})
                        </button>
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <ThumbsDown className="w-4 h-4" />
                          ({review.unhelpful})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <div 
                className="bg-card rounded-2xl border border-border p-6 space-y-4 animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                <Button className="w-full rounded-full gap-2" asChild>
                  <a href={gameData.robloxLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Play on Roblox
                  </a>
                </Button>

                <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full rounded-full gap-2">
                      <Star className="w-4 h-4" />
                      Rate This Game
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Rate This Game</DialogTitle>
                      <DialogDescription>
                        Help other players by rating this game on safety criteria
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      {['honesty', 'safety', 'fairness', 'ageAppropriate'].map((category) => (
                        <div key={category} className="flex items-center justify-between">
                          <span className="capitalize font-medium">
                            {category.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <StarRating 
                            value={userRatings[category as keyof typeof userRatings]} 
                            onChange={(v) => setUserRatings({ ...userRatings, [category]: v })}
                          />
                        </div>
                      ))}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Review (Optional)</label>
                        <Textarea 
                          placeholder="Share your experience with this game..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <Button className="w-full rounded-full" onClick={handleSubmitRating}>
                        Submit Rating
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full rounded-full gap-2 text-muted-foreground">
                      <Flag className="w-4 h-4" />
                      Report an Issue
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Report an Issue</DialogTitle>
                      <DialogDescription>
                        Let us know if there's a problem with this game's safety rating
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Textarea 
                        placeholder="Describe the issue..."
                        rows={4}
                      />
                      <Button className="w-full rounded-full" onClick={handleSubmitReport}>
                        Submit Report
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Quick Stats */}
              <div 
                className="bg-card rounded-2xl border border-border p-6 animate-fade-in"
                style={{ animationDelay: "0.15s" }}
              >
                <h3 className="font-bold text-foreground mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Ratings</p>
                      <p className="font-bold text-foreground">{gameData.ratingCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reviews</p>
                      <p className="font-bold text-foreground">{gameData.reviews.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-bold text-foreground">Dec 2024</p>
                    </div>
                  </div>
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

export default GameDetail;
