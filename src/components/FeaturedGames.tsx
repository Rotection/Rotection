import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/GameCard";
import { Link } from "react-router-dom";

// Sample data - in a real app, this would come from the database
const featuredGames = [
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
];

export function FeaturedGames() {
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
            These games have been verified by Rotection and loved by players like you!
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featuredGames.map((game, index) => (
            <div
              key={game.id}
              className="animate-fade-in"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <GameCard {...game} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Link to="/games">
            <Button 
              size="lg" 
              className="rounded-full px-8"
            >
              Browse All Verified Games
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
