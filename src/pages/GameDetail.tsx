import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Star,
  Users,
  Calendar,
  ExternalLink,
  Flag,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Sample games database - in a real app, this would come from your database
const gamesDatabase = {
  "101411193179895": {
    id: "101411193179895",
    title: "[ METALLIX ] Speedsters Sandbox",
    developer: "Speedsters Sandbox",
    imageUrl:
      "https://tr.rbxcdn.com/180DAY-bf6e00c4f61b35b36ea92d828e4c3232/768/432/Image/Webp/noFilter",
    safetyScore: 90,
    rating: 4.5,
    ratingCount: 12,
    ageRating: "5+",
    genre: "Sandbox",
    verified: true,
    description:
      "An amazing sandbox game where you can become a speedster and explore a vast world with other players. Experience lightning-fast gameplay with friends in this safe, moderated environment.",
    robloxLink: "https://www.roblox.com/games/101411193179895",
    lastUpdated: "Dec 2024",
    totalPlays: "2.5M+",
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
        content:
          "My kids love this game. No concerns about safety or inappropriate content.",
        date: "2024-12-10",
        helpful: 18,
        unhelpful: 1,
      },
    ],
  },
  "2": {
    id: "2",
    title: "Pilgrammed",
    developer: "Phexonia Studios",
    imageUrl:
      "https://tr.rbxcdn.com/180DAY-1985fb1fa6534213463d7814f3958298/768/432/Image/Webp/noFilter",
    safetyScore: 80,
    rating: 4.0,
    ratingCount: 1,
    ageRating: "9+",
    genre: "Party & Casual",
    verified: false,
    description:
      "A unique party game experience where players can engage in various mini-games and social activities. Perfect for group play with built-in safety features.",
    robloxLink: "https://www.roblox.com/games/2",
    lastUpdated: "Nov 2024",
    totalPlays: "850K+",
    ratings: {
      honesty: 4.0,
      safety: 4.2,
      fairness: 3.8,
      ageAppropriate: 4.1,
    },
    reviews: [
      {
        id: "3",
        author: "CasualGamer",
        rating: 4,
        content:
          "Fun party game with friends. Some minor issues but overall good.",
        date: "2024-11-20",
        helpful: 12,
        unhelpful: 1,
      },
    ],
  },
  "3": {
    id: "3",
    title: "Prophecy Battle Arena",
    developer: "@GoldenObscurity",
    imageUrl:
      "https://tr.rbxcdn.com/180DAY-f686b29c5acc0a09de9c8edb5eaddfd6/768/432/Image/Webp/noFilter",
    safetyScore: 90,
    rating: 4.5,
    ratingCount: 1,
    ageRating: "9+",
    genre: "Action RPG",
    verified: true,
    description:
      "Enter an epic battle arena where strategy meets action. Fight mythical creatures and other players in this carefully moderated RPG environment.",
    robloxLink: "https://www.roblox.com/games/3",
    lastUpdated: "Dec 2024",
    totalPlays: "1.2M+",
    ratings: {
      honesty: 4.6,
      safety: 4.7,
      fairness: 4.3,
      ageAppropriate: 4.4,
    },
    reviews: [
      {
        id: "4",
        author: "RPGFan",
        rating: 5,
        content:
          "Amazing RPG with great community moderation. Very fair gameplay!",
        date: "2024-12-01",
        helpful: 8,
        unhelpful: 0,
      },
    ],
  },
  "4": {
    id: "4",
    title: "Adopt Me!",
    developer: "DreamCraft",
    imageUrl:
      "https://tr.rbxcdn.com/180DAY-e5f0eba9e9f8ac0c1af1d7f7c25d2ec7/768/432/Image/Webp/noFilter",
    safetyScore: 95,
    rating: 4.8,
    ratingCount: 156,
    ageRating: "5+",
    genre: "Roleplay",
    verified: true,
    description:
      "The most popular pet adoption game on Roblox! Adopt pets, decorate your house, and make friends in this incredibly safe and moderated environment.",
    robloxLink: "https://www.roblox.com/games/4",
    lastUpdated: "Jan 2025",
    totalPlays: "50M+",
    ratings: {
      honesty: 4.9,
      safety: 4.8,
      fairness: 4.7,
      ageAppropriate: 4.9,
    },
    reviews: [
      {
        id: "5",
        author: "ParentUser",
        rating: 5,
        content:
          "Perfect game for young children. Excellent safety features and moderation.",
        date: "2024-12-20",
        helpful: 45,
        unhelpful: 1,
      },
      {
        id: "6",
        author: "KidGamer",
        rating: 5,
        content:
          "I love adopting pets and decorating my house! Very fun and safe!",
        date: "2024-12-18",
        helpful: 32,
        unhelpful: 0,
      },
    ],
  },
};

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [userRatings, setUserRatings] = useState({
    honesty: 0,
    safety: 0,
    fairness: 0,
    ageAppropriate: 0,
  });
  const [reviewText, setReviewText] = useState("");
  const [reportText, setReportText] = useState("");

  useEffect(() => {
    const fetchGameData = async () => {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (id && gamesDatabase[id]) {
        setGameData(gamesDatabase[id]);
      } else {
        setError("Game not found");
      }

      setLoading(false);
    };

    fetchGameData();
  }, [id]);

  const getSafetyColor = (score) => {
    if (score >= 80) return "text-green-700 bg-green-100 border-green-200";
    if (score >= 60) return "text-yellow-700 bg-yellow-100 border-yellow-200";
    return "text-red-700 bg-red-100 border-red-200";
  };

  const handleSubmitRating = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to rate games",
        variant: "destructive",
      });
      return;
    }

    if (Object.values(userRatings).some((r) => r === 0)) {
      toast({
        title: "Incomplete rating",
        description: "Please rate all categories",
        variant: "destructive",
      });
      return;
    }

    // In a real app, submit to database
    toast({
      title: "Rating Submitted!",
      description: "Thank you for helping the community!",
    });

    setShowRatingDialog(false);
    setUserRatings({ honesty: 0, safety: 0, fairness: 0, ageAppropriate: 0 });
    setReviewText("");
  };

  const handleSubmitReport = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to report issues",
        variant: "destructive",
      });
      return;
    }

    if (!reportText.trim()) {
      toast({
        title: "Report description required",
        description: "Please describe the issue",
        variant: "destructive",
      });
      return;
    }

    // In a real app, submit to database
    toast({
      title: "Report Submitted",
      description: "Our moderators will review your report shortly.",
    });

    setShowReportDialog(false);
    setReportText("");
  };

  const StarRating = ({ value, onChange, readonly = false }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`transition-colors ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
        >
          <Star
            className={`w-5 h-5 ${star <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading game details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !gameData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4 max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold">Game Not Found</h2>
            <p className="text-muted-foreground">
              The game you're looking for doesn't exist or may have been
              removed.
            </p>
            <Button onClick={() => navigate("/games")} className="mt-4">
              Browse All Games
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 animate-fade-in">
            <Link to="/games" className="hover:text-primary transition-colors">
              Games
            </Link>
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
              <div
                className="animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                <h1 className="text-3xl font-extrabold text-primary mb-2">
                  {gameData.title}
                </h1>
                <p className="text-muted-foreground text-lg mb-4">
                  by {gameData.developer}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Badge
                    className={`px-4 py-2 border ${getSafetyColor(gameData.safetyScore)}`}
                    variant="outline"
                  >
                    Safety Score: {gameData.safetyScore}%
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium text-foreground">
                      {gameData.rating.toFixed(1)}
                    </span>
                    <span>({gameData.ratingCount} ratings)</span>
                  </div>
                  <Badge variant="secondary">{gameData.ageRating}</Badge>
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    {gameData.genre}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div
                className="bg-card rounded-2xl border border-border p-6 animate-fade-in"
                style={{ animationDelay: "0.15s" }}
              >
                <h2 className="text-xl font-bold text-foreground mb-4">
                  About This Game
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {gameData.description}
                </p>
              </div>

              {/* Category Ratings */}
              <div
                className="bg-card rounded-2xl border border-border p-6 animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Safety Ratings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(gameData.ratings).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <div className="flex items-center gap-2">
                        <StarRating value={Math.round(value)} readonly />
                        <span className="text-foreground font-medium min-w-[2rem]">
                          {value.toFixed(1)}
                        </span>
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
                  <h2 className="text-xl font-bold text-foreground">
                    Player Reviews
                  </h2>
                  <span className="text-muted-foreground">
                    {gameData.reviews.length} reviews
                  </span>
                </div>

                {gameData.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {gameData.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-border pb-6 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium text-foreground">
                              {review.author}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <StarRating value={review.rating} readonly />
                              <span className="text-sm text-muted-foreground">
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {review.content}
                        </p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            Helpful ({review.helpful})
                          </button>
                          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <ThumbsDown className="w-4 h-4" />(
                            {review.unhelpful})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No reviews yet. Be the first to review this game!
                    </p>
                  </div>
                )}
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
                  <a
                    href={gameData.robloxLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Play on Roblox
                  </a>
                </Button>

                <Dialog
                  open={showRatingDialog}
                  onOpenChange={setShowRatingDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full rounded-full gap-2"
                    >
                      <Star className="w-4 h-4" />
                      Rate This Game
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Rate This Game</DialogTitle>
                      <DialogDescription>
                        Help other players by rating this game on safety
                        criteria
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      {["honesty", "safety", "fairness", "ageAppropriate"].map(
                        (category) => (
                          <div
                            key={category}
                            className="flex items-center justify-between"
                          >
                            <span className="capitalize font-medium">
                              {category.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <StarRating
                              value={userRatings[category]}
                              onChange={(v) =>
                                setUserRatings({
                                  ...userRatings,
                                  [category]: v,
                                })
                              }
                            />
                          </div>
                        ),
                      )}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Review (Optional)
                        </label>
                        <Textarea
                          placeholder="Share your experience with this game..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <Button
                        className="w-full rounded-full"
                        onClick={handleSubmitRating}
                      >
                        Submit Rating
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={showReportDialog}
                  onOpenChange={setShowReportDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full rounded-full gap-2 text-muted-foreground"
                    >
                      <Flag className="w-4 h-4" />
                      Report an Issue
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Report an Issue</DialogTitle>
                      <DialogDescription>
                        Let us know if there's a problem with this game's safety
                        rating
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Textarea
                        placeholder="Describe the issue..."
                        value={reportText}
                        onChange={(e) => setReportText(e.target.value)}
                        rows={4}
                      />
                      <Button
                        className="w-full rounded-full"
                        onClick={handleSubmitReport}
                      >
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
                      <p className="text-sm text-muted-foreground">
                        Total Ratings
                      </p>
                      <p className="font-bold text-foreground">
                        {gameData.ratingCount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reviews</p>
                      <p className="font-bold text-foreground">
                        {gameData.reviews.length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Plays
                      </p>
                      <p className="font-bold text-foreground">
                        {gameData.totalPlays}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Last Updated
                      </p>
                      <p className="font-bold text-foreground">
                        {gameData.lastUpdated}
                      </p>
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
