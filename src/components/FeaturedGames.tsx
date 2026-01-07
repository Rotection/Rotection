import { useState, useEffect } from "react";
import { Shield, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/GameCard";
import { Link } from "react-router-dom";
import { GameService, type Game } from "@/services/gameService";

export function FeaturedGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedGames = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch verified games with high ratings, limit to 6 for featured section
        const featuredGames = await GameService.getAllGames({
          verifiedOnly: true,
          sortBy: "safety",
          limit: 6,
        });

        setGames(featuredGames);
      } catch (err) {
        console.error("Failed to load featured games:", err);
        setError("Failed to load featured games");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedGames();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl text-primary mb-4 flex items-center justify-center gap-3">
              <Shield className="w-10 h-10" />
              Featured Safe Games
            </h2>
            <p className="text-muted-foreground text-lg">
              These games have been verified by Rotection and loved by players
              like you!
            </p>
          </div>

          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Loading featured games...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error && games.length === 0) {
    return (
      <section className="py-20 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl text-primary mb-4 flex items-center justify-center gap-3">
              <Shield className="w-10 h-10" />
              Featured Safe Games
            </h2>
            <p className="text-muted-foreground text-lg">
              These games have been verified by Rotection and loved by players
              like you!
            </p>
          </div>

          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4 max-w-md">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h3 className="text-xl font-bold">
                Failed to Load Featured Games
              </h3>
              <p className="text-muted-foreground">{error}</p>
              <Link to="/games">
                <Button variant="outline">Browse All Games</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Success state
  return (
    <section className="py-20 px-4">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl text-primary mb-4 flex items-center justify-center gap-3">
            <Shield className="w-10 h-10" />
            Featured Safe Games
          </h2>
          <p className="text-muted-foreground text-lg">
            These games have been verified by Rotection and loved by players
            like you!
          </p>
        </div>

        {/* Games Grid */}
        {games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {games.map((game, index) => (
              <div
                key={game.id}
                className="animate-fade-in"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <GameCard {...game} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Shield className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No Featured Games Yet
            </h3>
            <p className="text-muted-foreground mb-4">
              We're working on verifying games to feature here. Check back soon!
            </p>
          </div>
        )}

        {/* CTA */}
        <div
          className="text-center animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <Link to="/games">
            <Button size="lg" className="rounded-full px-8">
              Browse All Verified Games
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
