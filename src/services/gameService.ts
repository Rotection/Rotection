// Game service for managing game data and operations
import { supabase } from '@/integrations/supabase/client';

export interface Game {
  id: string;
  title: string;
  developer: string;
  imageUrl: string;
  safetyScore: number;
  rating: number;
  ratingCount: number;
  ageRating: string;
  genre: string;
  verified: boolean;
  description: string;
  robloxLink: string;
  lastUpdated: string;
  totalPlays: string;
  ratings: {
    honesty: number;
    safety: number;
    fairness: number;
    ageAppropriate: number;
  };
  reviews: Review[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  helpful: number;
  unhelpful: number;
}

export interface GameRating {
  honesty: number;
  safety: number;
  fairness: number;
  ageAppropriate: number;
}

// Sample games database - in production, this would come from Supabase
const sampleGames: Record<string, Game> = {
  "101411193179895": {
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
    description: "An amazing sandbox game where you can become a speedster and explore a vast world with other players. Experience lightning-fast gameplay with friends in this safe, moderated environment.",
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
        content: "My kids love this game. No concerns about safety or inappropriate content.",
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
    imageUrl: "https://tr.rbxcdn.com/180DAY-1985fb1fa6534213463d7814f3958298/768/432/Image/Webp/noFilter",
    safetyScore: 80,
    rating: 4.0,
    ratingCount: 1,
    ageRating: "9+",
    genre: "Party & Casual",
    verified: false,
    description: "A unique party game experience where players can engage in various mini-games and social activities. Perfect for group play with built-in safety features.",
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
        content: "Fun party game with friends. Some minor issues but overall good.",
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
    imageUrl: "https://tr.rbxcdn.com/180DAY-f686b29c5acc0a09de9c8edb5eaddfd6/768/432/Image/Webp/noFilter",
    safetyScore: 90,
    rating: 4.5,
    ratingCount: 1,
    ageRating: "9+",
    genre: "Action RPG",
    verified: true,
    description: "Enter an epic battle arena where strategy meets action. Fight mythical creatures and other players in this carefully moderated RPG environment.",
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
        content: "Amazing RPG with great community moderation. Very fair gameplay!",
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
    imageUrl: "https://tr.rbxcdn.com/180DAY-e5f0eba9e9f8ac0c1af1d7f7c25d2ec7/768/432/Image/Webp/noFilter",
    safetyScore: 95,
    rating: 4.8,
    ratingCount: 156,
    ageRating: "5+",
    genre: "Roleplay",
    verified: true,
    description: "The most popular pet adoption game on Roblox! Adopt pets, decorate your house, and make friends in this incredibly safe and moderated environment.",
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
        content: "Perfect game for young children. Excellent safety features and moderation.",
        date: "2024-12-20",
        helpful: 45,
        unhelpful: 1,
      },
      {
        id: "6",
        author: "KidGamer",
        rating: 5,
        content: "I love adopting pets and decorating my house! Very fun and safe!",
        date: "2024-12-18",
        helpful: 32,
        unhelpful: 0,
      },
    ],
  },
  "5": {
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
    description: "A thrilling mystery game where players take on the roles of innocent, sheriff, or murderer. Features careful content moderation and age-appropriate gameplay.",
    robloxLink: "https://www.roblox.com/games/5",
    lastUpdated: "Dec 2024",
    totalPlays: "15M+",
    ratings: {
      honesty: 4.1,
      safety: 3.8,
      fairness: 4.3,
      ageAppropriate: 4.0,
    },
    reviews: [
      {
        id: "7",
        author: "MysteryFan",
        rating: 4,
        content: "Fun mystery game but can be intense for younger players.",
        date: "2024-12-05",
        helpful: 23,
        unhelpful: 3,
      },
    ],
  },
  "6": {
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
    description: "Challenge yourself with randomly generated obstacle courses! Test your parkour skills in this popular obby game with excellent community moderation.",
    robloxLink: "https://www.roblox.com/games/6",
    lastUpdated: "Jan 2025",
    totalPlays: "30M+",
    ratings: {
      honesty: 4.5,
      safety: 4.4,
      fairness: 4.3,
      ageAppropriate: 4.4,
    },
    reviews: [
      {
        id: "8",
        author: "ObbyMaster",
        rating: 5,
        content: "Best obby game ever! Great for improving parkour skills.",
        date: "2024-12-22",
        helpful: 67,
        unhelpful: 2,
      },
      {
        id: "9",
        author: "ChallengeSeeker",
        rating: 4,
        content: "Really challenging but fair. Good for competitive players.",
        date: "2024-12-18",
        helpful: 34,
        unhelpful: 1,
      },
    ],
  },
};

export class GameService {
  /**
   * Get all games with optional filtering
   */
  static async getAllGames(filters?: {
    search?: string;
    genre?: string;
    verifiedOnly?: boolean;
    sortBy?: 'popular' | 'safety' | 'newest' | 'rated';
  }): Promise<Game[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let games = Object.values(sampleGames);

    if (filters) {
      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        games = games.filter(game =>
          game.title.toLowerCase().includes(searchTerm) ||
          game.developer.toLowerCase().includes(searchTerm)
        );
      }

      // Apply genre filter
      if (filters.genre && filters.genre !== 'All Genres') {
        games = games.filter(game => game.genre === filters.genre);
      }

      // Apply verified filter
      if (filters.verifiedOnly) {
        games = games.filter(game => game.verified);
      }

      // Apply sorting
      if (filters.sortBy) {
        games.sort((a, b) => {
          switch (filters.sortBy) {
            case 'safety':
              return b.safetyScore - a.safetyScore;
            case 'rated':
              return b.rating - a.rating;
            case 'popular':
              return b.ratingCount - a.ratingCount;
            case 'newest':
              return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
            default:
              return 0;
          }
        });
      }
    }

    return games;
  }

  /**
   * Get a single game by ID
   */
  static async getGameById(id: string): Promise<Game | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return sampleGames[id] || null;
  }

  /**
   * Submit a rating for a game
   */
  static async submitRating(
    gameId: string,
    userId: string,
    ratings: GameRating,
    review?: string
  ): Promise<{ success: boolean; message: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // In a real app, this would save to the database
      console.log('Submitting rating:', { gameId, userId, ratings, review });

      // TODO: Implement actual database save
      // const { error } = await supabase
      //   .from('game_ratings')
      //   .insert({
      //     game_id: gameId,
      //     user_id: userId,
      //     honesty: ratings.honesty,
      //     safety: ratings.safety,
      //     fairness: ratings.fairness,
      //     age_appropriate: ratings.ageAppropriate,
      //     review,
      //     created_at: new Date().toISOString(),
      //   });

      return { success: true, message: 'Rating submitted successfully!' };
    } catch (error) {
      console.error('Error submitting rating:', error);
      return { success: false, message: 'Failed to submit rating. Please try again.' };
    }
  }

  /**
   * Submit a report for a game
   */
  static async submitReport(
    gameId: string,
    userId: string,
    description: string
  ): Promise<{ success: boolean; message: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      // In a real app, this would save to the database
      console.log('Submitting report:', { gameId, userId, description });

      // TODO: Implement actual database save
      // const { error } = await supabase
      //   .from('game_reports')
      //   .insert({
      //     game_id: gameId,
      //     user_id: userId,
      //     description,
      //     status: 'pending',
      //     created_at: new Date().toISOString(),
      //   });

      return { success: true, message: 'Report submitted successfully!' };
    } catch (error) {
      console.error('Error submitting report:', error);
      return { success: false, message: 'Failed to submit report. Please try again.' };
    }
  }

  /**
   * Get featured/recommended games
   */
  static async getFeaturedGames(limit: number = 6): Promise<Game[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const allGames = Object.values(sampleGames);

    // Return highest rated verified games
    return allGames
      .filter(game => game.verified)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  /**
   * Search games by title or developer
   */
  static async searchGames(query: string): Promise<Game[]> {
    if (!query.trim()) return [];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const searchTerm = query.toLowerCase();
    return Object.values(sampleGames).filter(game =>
      game.title.toLowerCase().includes(searchTerm) ||
      game.developer.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Get games by genre
   */
  static async getGamesByGenre(genre: string): Promise<Game[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return Object.values(sampleGames).filter(game => game.genre === genre);
  }

  /**
   * Get available genres
   */
  static async getGenres(): Promise<string[]> {
    const games = Object.values(sampleGames);
    const genres = [...new Set(games.map(game => game.genre))];
    return genres.sort();
  }

  /**
   * Helper function to calculate safety color classes
   */
  static getSafetyColorClasses(score: number): string {
    if (score >= 80) return "text-green-700 bg-green-100 border-green-200";
    if (score >= 60) return "text-yellow-700 bg-yellow-100 border-yellow-200";
    return "text-red-700 bg-red-100 border-red-200";
  }

  /**
   * Helper function to format rating display
   */
  static formatRating(rating: number): string {
    return rating.toFixed(1);
  }

  /**
   * Helper function to get age rating color
   */
  static getAgeRatingColor(ageRating: string): string {
    const age = parseInt(ageRating);
    if (age <= 5) return "bg-green-100 text-green-800 border-green-200";
    if (age <= 9) return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-orange-100 text-orange-800 border-orange-200";
  }
}

export default GameService;
