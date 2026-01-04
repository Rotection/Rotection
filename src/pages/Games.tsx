import { useState } from "react";
import { Search, Filter, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GameCard } from "@/components/GameCard";

// Sample data - in a real app, this would come from the database
const allGames = [
  {
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
  },
  {
    id: "2",
    title: "Pilgrammed",
    developer: "Phexonia Studios",
    imageUrl: "https://tr.rbxcdn.com/180DAY-1985fb1fa6534213463d7814f3958298/768/432/Image/Webp/noFilter",
    safetyScore: 80,
    rating: 4.0,
    ratingCount: 1,
    ageRating: "9+",
    genre: "Party & Casual",
    verified: false,
  },
  {
    id: "3",
    title: "Prophecy Battle Arena",
    developer: "@GoldenObscurity",
    imageUrl: "https://tr.rbxcdn.com/180DAY-f686b29c5acc0a09de9c8edb5eaddfd6/768/432/Image/Webp/noFilter",
    safetyScore: 90,
    rating: 4.5,
    ratingCount: 1,
    ageRating: "9+",
    genre: "Action RPG",
    verified: true,
  },
  {
    id: "4",
    title: "Adopt Me!",
    developer: "DreamCraft",
    imageUrl: "https://tr.rbxcdn.com/180DAY-e5f0eba9e9f8ac0c1af1d7f7c25d2ec7/768/432/Image/Webp/noFilter",
    safetyScore: 95,
    rating: 4.8,
    ratingCount: 156,
    ageRating: "5+",
    genre: "Roleplay",
    verified: true,
  },
  {
    id: "5",
    title: "Murder Mystery 2",
    developer: "Nikilis",
    imageUrl: "https://tr.rbxcdn.com/180DAY-62fb6bef5e15c8bf7d3c0f8e25c2a9b8/768/432/Image/Webp/noFilter",
    safetyScore: 75,
    rating: 4.2,
    ratingCount: 89,
    ageRating: "9+",
    genre: "Horror",
    verified: true,
  },
  {
    id: "6",
    title: "Tower of Hell",
    developer: "YXCeptional Studios",
    imageUrl: "https://tr.rbxcdn.com/180DAY-c3b5f8e9d2a1b7c4e6f8a0b3c5d7e9f1/768/432/Image/Webp/noFilter",
    safetyScore: 88,
    rating: 4.4,
    ratingCount: 234,
    ageRating: "7+",
    genre: "Obby",
    verified: true,
  },
];

const genres = ["All Genres", "Action RPG", "Adventure", "Horror", "Obby", "Party & Casual", "Roleplay", "Sandbox"];
const sortOptions = ["Most Popular", "Highest Safety", "Newest", "Top Rated"];

const Games = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const filteredGames = allGames.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.developer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "All Genres" || game.genre === selectedGenre;
    const matchesVerified = !showVerifiedOnly || game.verified;
    
    return matchesSearch && matchesGenre && matchesVerified;
  });

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
              Find verified Roblox games that are safe, fair, and age-appropriate for everyone.
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
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
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
                    <SelectItem key={option} value={option}>{option}</SelectItem>
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

          {/* Results Count */}
          <p className="text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.15s" }}>
            Showing {filteredGames.length} {filteredGames.length === 1 ? "game" : "games"}
          </p>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game, index) => (
              <div
                key={game.id}
                className="animate-fade-in"
                style={{ animationDelay: `${(index + 2) * 0.05}s` }}
              >
                <GameCard {...game} />
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredGames.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No games found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Games;
