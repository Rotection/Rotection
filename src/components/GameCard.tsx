import { Shield, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface GameCardProps {
  id: string;
  title: string;
  developer: string;
  imageUrl: string;
  safetyScore: number;
  rating?: number;
  ratingCount: number;
  ageRating: string;
  genre: string;
  verified?: boolean;
}

export function GameCard({
  id,
  title,
  developer,
  imageUrl,
  safetyScore,
  rating,
  ratingCount,
  ageRating,
  genre,
  verified = false,
}: GameCardProps) {
  const getSafetyColor = (score: number) => {
    if (score >= 80) return "text-safety-high bg-safety-high-bg";
    if (score >= 60) return "text-safety-medium bg-safety-medium-bg";
    return "text-safety-low bg-safety-low-bg";
  };

  return (
    <Link to={`/game/${id}`}>
      <div className="bg-card rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group border border-border/50">
        {/* Image */}
        <div className="relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Verified Badge */}
          {verified && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1.5 text-sm font-medium">
              <Shield className="w-4 h-4" />
              <span>Verified</span>
            </div>
          )}

          {/* Safety Score */}
          <div
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-medium ${getSafetyColor(safetyScore)}`}
          >
            Safety: {safetyScore}%
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title & Age */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-primary font-bold text-lg truncate mb-1">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm truncate">
                by {developer}
              </p>
            </div>
            <div className="bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md text-sm font-medium ml-2">
              {ageRating}
            </div>
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-star fill-star" />
              <span>{rating ? rating.toFixed(1) : "0.0"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>
                {ratingCount} {ratingCount === 1 ? "rating" : "ratings"}
              </span>
            </div>
          </div>

          {/* Genre Tag */}
          <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {genre}
          </div>
        </div>
      </div>
    </Link>
  );
}
