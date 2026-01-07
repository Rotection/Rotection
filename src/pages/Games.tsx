import { useState, useEffect } from "react";
import { Search, Filter, Shield, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GameCard } from "@/components/GameCard";
import { GameService, type Game } from "@/services/gameService";

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "safety", label: "Highest Safety" },
  { value: "newest", label: "Newest" },
  { value: "rated", label: "Top Rated" },
];

const Games = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [sortBy, setSortBy] = useState("popular");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 DEBUG: Starting to load games...");
        console.log(
          "🔍 DEBUG: Supabase URL:",
          import.meta.env.VITE_SUPABASE_URL,
        );
        console.log(
          "🔍 DEBUG: Has Anon Key:",
          !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        );

        // Load genres
        console.log("🔍 DEBUG: Loading genres...");
        const genreList = await GameService.getGenres();
        console.log("🔍 DEBUG: Genres loaded:", genreList);
        setGenres(["All Genres", ...genreList]);

        // Load all games
        console.log("🔍 DEBUG: Loading games with filters:", {
          search: searchQuery,
          genre: selectedGenre,
          verifiedOnly: showVerifiedOnly,
          sortBy: sortBy,
        });
        const allGames = await GameService.getAllGames({
          search: searchQuery,
          genre: selectedGenre,
          verifiedOnly: showVerifiedOnly,
          sortBy: sortBy as any,
        });

        console.log("🔍 DEBUG: Games loaded:", allGames.length, "games");
        console.log("🔍 DEBUG: First game:", allGames[0]);
        setGames(allGames);
      } catch (err) {
        console.error("❌ DEBUG: Failed to load games:", err);
        setError("Failed to load games. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Filter games when filters change
  useEffect(() => {
    const loadFilteredGames = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 DEBUG: Filtering games with:", {
          search: searchQuery,
          genre: selectedGenre,
          verifiedOnly: showVerifiedOnly,
          sortBy: sortBy,
        });

        const filteredGames = await GameService.getAllGames({
          search: searchQuery,
          genre: selectedGenre,
          verifiedOnly: showVerifiedOnly,
          sortBy: sortBy as any,
        });

        console.log(
          "🔍 DEBUG: Filtered games result:",
          filteredGames.length,
          "games",
        );
        setGames(filteredGames);
      } catch (err) {
        console.error("❌ DEBUG: Failed to filter games:", err);
        setError("Failed to load games. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(
      () => {
        loadFilteredGames();
      },
      searchQuery ? 300 : 0,
    );

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedGenre, sortBy, showVerifiedOnly]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (error && games.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4 max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold">Failed to Load Games</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={handleRetry}>Try Again</Button>
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
        <div className="container max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
              Browse Safe Games
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find verified Roblox games that are safe, fair, and
              age-appropriate for everyone.
            </p>
          </div>

          {/* Filters */}
          <div
            className="bg-card rounded-2xl border border-border p-6 mb-8 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search games or developers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>

              {/* Genre Filter */}
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-full lg:w-48 h-12">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Verified Toggle */}
              <Button
                variant={showVerifiedOnly ? "default" : "outline"}
                className="h-12 rounded-full gap-2"
                onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
              >
                <Shield className="w-4 h-4" />
                Verified Only
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading && games.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p className="text-muted-foreground">Loading games...</p>
              </div>
            </div>
          )}

          {/* Results Count */}
          {!loading && (
            <div
              className="flex items-center justify-between mb-6 animate-fade-in"
              style={{ animationDelay: "0.15s" }}
            >
              <p className="text-muted-foreground">
                Showing {games.length} {games.length === 1 ? "game" : "games"}
                {searchQuery && ` for "${searchQuery}"`}
                {selectedGenre !== "All Genres" && ` in ${selectedGenre}`}
                {showVerifiedOnly && " (verified only)"}
              </p>

              {loading && games.length > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Updating...</span>
                </div>
              )}
            </div>
          )}

          {/* Games Grid */}
          {!loading && games.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game, index) => (
                <div
                  key={game.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${(index + 2) * 0.05}s` }}
                >
                  <GameCard {...game} />
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && games.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                No games found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ||
                selectedGenre !== "All Genres" ||
                showVerifiedOnly
                  ? "Try adjusting your search or filters"
                  : "No games available at the moment"}
              </p>
              {(searchQuery ||
                selectedGenre !== "All Genres" ||
                showVerifiedOnly) && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedGenre("All Genres");
                      setShowVerifiedOnly(false);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Error State (when games exist but filter fails) */}
          {error && games.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm font-medium">
                  There was an issue updating the results. Showing previous
                  results.
                </p>
              </div>
            </div>
          )}

          {/* Game Statistics (optional footer section) */}
          {!loading && games.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">
                    {games.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Games{" "}
                    {searchQuery ||
                    selectedGenre !== "All Genres" ||
                    showVerifiedOnly
                      ? "matching filters"
                      : "available"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">
                    {games.filter((g) => g.verified).length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Verified Safe Games
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">
                    {Math.round(
                      games.reduce((acc, game) => acc + game.safetyScore, 0) /
                        games.length,
                    )}
                    %
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Average Safety Score
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Games;
