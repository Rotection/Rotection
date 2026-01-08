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
import { GameService } from "@/services/gameService";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Dynamic game data will be loaded from Supabase database

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [gameData, setGameData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(null);
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
      if (!id) return;

      console.log("🎮 DEBUG: GameDetail - Fetching game with ID:", id);
      setLoading(true);
      setError(null);

      try {
        // Fetch game data
        console.log("🎮 DEBUG: GameDetail - Calling getGameById...");
        let game = await GameService.getGameById(id);
        console.log("🎮 DEBUG: GameDetail - Game result:", game);

        // Fallback: if not found by app `id`, try roblox_id and redirect to canonical id
        if (!game) {
          console.log("🎮 DEBUG: GameDetail - Not found by id, trying roblox_id lookup for:", id);
          const byRoblox = await GameService.getGameByRobloxId(id);
          console.log("🎮 DEBUG: GameDetail - getGameByRobloxId result:", byRoblox);
          if (byRoblox) {
            // Redirect to canonical game id URL
            navigate(`/game/${byRoblox.id}`);
            return;
          }

          console.log("❌ DEBUG: GameDetail - No game found for ID:", id);
          setError("Game not found");
          return;
        }
        console.log(
          "✅ DEBUG: GameDetail - Game loaded successfully:",
          game.title,
        );
        setGameData(game);

        // Fetch reviews
        const gameReviews = await GameService.getGameReviews(id);
        setReviews(gameReviews);

        // Fetch user's existing rating if logged in
        if (user) {
          const rating = await GameService.getUserRating(id, user.id);
          if (rating) {
            setUserRating({
              honesty: rating.honesty,
              safety: rating.safety,
              fairness: rating.fairness,
              ageAppropriate: rating.age_appropriate,
            });
          }
        }
      } catch (err) {
        console.error("Error fetching game data:", err);
        setError("Failed to load game data");
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [id, user]);

  const getSafetyColor = (score) => {
    if (score >= 80) return "text-green-700 bg-green-100 border-green-200";
    if (score >= 60) return "text-yellow-700 bg-yellow-100 border-yellow-200";
    return "text-red-700 bg-red-100 border-red-200";
  };

  const handleSubmitRating = async () => {
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

    if (!gameData) return;

    setIsLoading(true);
    try {
      const result = await GameService.submitRating(
        gameData.id,
        user.id,
        {
          honesty: userRatings.honesty,
          safety: userRatings.safety,
          fairness: userRatings.fairness,
          age_appropriate: userRatings.ageAppropriate,
        },
        reviewText.trim() || undefined,
      );

      if (result.success) {
        toast({
          title: "Rating Submitted!",
          description: result.message,
        });

        // Refresh game data to show updated ratings
        const updatedGame = await GameService.getGameById(gameData.id);
        if (updatedGame) {
          setGameData(updatedGame);
        }

        // Refresh reviews if a review was submitted
        if (reviewText.trim()) {
          const gameReviews = await GameService.getGameReviews(gameData.id);
          setReviews(gameReviews);
        }

        setShowRatingDialog(false);
        setUserRatings({
          honesty: 0,
          safety: 0,
          fairness: 0,
          ageAppropriate: 0,
        });
        setReviewText("");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReport = async () => {
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

    if (!gameData) return;

    setIsLoading(true);
    try {
      const result = await GameService.submitReport(
        gameData.id,
        user.id,
        reportText.trim(),
        user.email,
        profile?.username || "Anonymous",
        gameData.title,
      );

      if (result.success) {
        toast({
          title: "Report Submitted",
          description: result.message,
        });
        setShowReportDialog(false);
        setReportText("");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                  src={
                    gameData.imageUrl || gameData.thumbnail_url || gameData.thumbnailUrl || ""
                  }
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
                    className={`px-4 py-2 border ${getSafetyColor(gameData.safety_score || 50)}`}
                    variant="outline"
                  >
                    Safety Score: {gameData.safety_score || 50}%
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium text-foreground">
                      {gameData.avg_overall_rating
                        ? gameData.avg_overall_rating.toFixed(1)
                        : "0.0"}
                    </span>
                    <span>({gameData.rating_count || 0} ratings)</span>
                  </div>
                  <Badge variant="secondary">{gameData.age_rating}</Badge>
                  {gameData.genre && (
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {gameData.genre}
                    </Badge>
                  )}
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
                  {[
                    {
                      key: "honesty",
                      label: "Honesty",
                      value: gameData.avg_honesty || 0,
                    },
                    {
                      key: "safety",
                      label: "Safety",
                      value: gameData.avg_safety || 0,
                    },
                    {
                      key: "fairness",
                      label: "Fairness",
                      value: gameData.avg_fairness || 0,
                    },
                    {
                      key: "age_appropriate",
                      label: "Age Appropriate",
                      value: gameData.avg_age_appropriate || 0,
                    },
                  ].map(({ key, label, value }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <span className="text-muted-foreground">{label}</span>
                      <div className="flex items-center gap-2">
                        <StarRating value={Math.round(value)} readonly />
                        <span className="text-foreground font-medium min-w-[2rem]">
                          {value ? value.toFixed(1) : "0.0"}
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
                    {reviews.length} reviews
                  </span>
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-border pb-6 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium text-foreground">
                              {review.author_username || "Anonymous"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <StarRating value={review.rating || 0} readonly />
                              <span className="text-sm text-muted-foreground">
                                {review.created_at
                                  ? new Date(
                                      review.created_at,
                                    ).toLocaleDateString()
                                  : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {review.content}
                        </p>
                        <div className="flex items-center gap-4">
                          <button
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() =>
                              user &&
                              GameService.voteOnReview(review.id, user.id, true)
                            }
                            disabled={!user}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            Helpful ({review.helpful_count || 0})
                          </button>
                          <button
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() =>
                              user &&
                              GameService.voteOnReview(
                                review.id,
                                user.id,
                                false,
                              )
                            }
                            disabled={!user}
                          >
                            <ThumbsDown className="w-4 h-4" />(
                            {review.unhelpful_count || 0})
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
                    href={gameData.roblox_url}
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
                        {gameData.rating_count || 0}
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
                        {reviews.length}
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
                        {GameService.formatVisitCount(gameData.total_plays)}
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
                        {gameData.updated_at
                          ? new Date(gameData.updated_at).toLocaleDateString()
                          : "Unknown"}
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
