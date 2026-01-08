// Dynamic Game service for managing real game data from Supabase
import { supabase } from "@/integrations/supabase/client";
import RobloxApiService from "./robloxApi";
import EmailService from "./emailService";

export interface Game {
  id: string;
  roblox_id: string;
  title: string;
  developer: string;
  description?: string;
  thumbnail_url?: string;
  roblox_url: string;
  genre?: string;
  age_rating: string;
  verified: boolean;
  status: "pending" | "approved" | "rejected";
  total_plays: string;
  submitted_by?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
  // Calculated fields from ratings
  avg_honesty?: number;
  avg_safety?: number;
  avg_fairness?: number;
  avg_age_appropriate?: number;
  avg_overall_rating?: number;
  rating_count?: number;
  safety_score?: number;
}

export interface GameRating {
  id?: string;
  game_id: string;
  user_id: string;
  honesty: number;
  safety: number;
  fairness: number;
  age_appropriate: number;
  overall_rating?: number;
  created_at?: string;
  updated_at?: string;
}

export interface GameReview {
  id?: string;
  game_id: string;
  user_id: string;
  rating_id?: string;
  content: string;
  helpful_count?: number;
  unhelpful_count?: number;
  created_at?: string;
  updated_at?: string;
  // Joined fields
  author_username?: string;
  rating?: number;
}

export interface GameReport {
  id?: string;
  game_id: string;
  user_id: string;
  description: string;
  status?: "pending" | "resolved" | "dismissed";
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GameSubmission {
  id?: string;
  roblox_url: string;
  roblox_id?: string;
  title?: string;
  developer?: string;
  description?: string;
  thumbnail_url?: string;
  genre?: string;
  submitter_id: string;
  status?: "pending" | "approved" | "rejected";
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export class GameService {
  /**
   * Get all approved games with optional filtering
   */
  static async getAllGames(filters?: {
    search?: string;
    genre?: string;
    verifiedOnly?: boolean;
    sortBy?: "popular" | "safety" | "newest" | "rated";
    limit?: number;
    offset?: number;
  }): Promise<Game[]> {
    try {
      console.log(
        "🎮 DEBUG: GameService.getAllGames called with filters:",
        filters,
      );

      let query = supabase
        .from("games_with_ratings")
        .select("*")
        .eq("status", "approved");

      console.log("🎮 DEBUG: Base query created for games_with_ratings");

      // Apply search filter
      if (filters?.search) {
        const searchTerm = `%${filters.search}%`;
        query = query.or(
          `title.ilike.${searchTerm},developer.ilike.${searchTerm}`,
        );
      }

      // Apply genre filter
      if (filters?.genre && filters.genre !== "All Genres") {
        query = query.eq("genre", filters.genre);
      }

      // Apply verified filter
      if (filters?.verifiedOnly) {
        query = query.eq("verified", true);
      }

      // Apply sorting
      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case "safety":
            query = query.order("safety_score", { ascending: false });
            break;
          case "rated":
            query = query.order("avg_overall_rating", { ascending: false });
            break;
          case "popular":
            query = query.order("rating_count", { ascending: false });
            break;
          case "newest":
            query = query.order("created_at", { ascending: false });
            break;
        }
      } else {
        // Default sort by rating count
        query = query.order("rating_count", { ascending: false });
      }

      // Apply pagination
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 50) - 1,
        );
      }

      console.log("🎮 DEBUG: Executing query...");
      const { data, error } = await query;

      console.log("🎮 DEBUG: Query result - Data count:", data?.length || 0);
      console.log("🎮 DEBUG: Query result - Error:", error);

      if (error) {
        console.error("❌ DEBUG: Error fetching games:", error);
        return [];
      }

      console.log("🎮 DEBUG: Returning games:", data?.length || 0);
      return data || [];
    } catch (error) {
      console.error("❌ DEBUG: Exception in getAllGames:", error);
      return [];
    }
  }

  /**
   * Get a single game by ID with ratings and reviews
   */
  static async getGameById(id: string): Promise<Game | null> {
    try {
      console.log("🎮 DEBUG: getGameById called with ID:", id);

      // Prefer reading directly from `games` table so manual edits are respected
      console.log("🎮 DEBUG: Querying `games` table for id", id);
      const { data: gameData, error: gameError } = await supabase
        .from("games")
        .select("*")
        .eq("id", id)
        .single();

      if (gameError) {
        console.warn("🎮 WARN: Error fetching from games table:", gameError);
      }

      if (gameData) {
        console.log("✅ DEBUG: getGameById returning game from `games`:", gameData?.title || "unknown");
        return gameData as any;
      }

      // Fallback: try view (may be filtered by status)
      console.log("🎮 DEBUG: Fallback - querying games_with_ratings view for id", id);
      const { data, error } = await supabase
        .from("games_with_ratings")
        .select("*")
        .eq("id", id)
        .eq("status", "approved")
        .single();

      if (error) {
        console.error("❌ DEBUG: Error fetching game by ID from view:", error);
        return null;
      }

      console.log("✅ DEBUG: getGameById returning game from view:", data?.title || "unknown");
      return data;
    } catch (error) {
      console.error("Error in getGameById:", error);
      return null;
    }
  }

  /**
   * Get game by Roblox ID
   */
  static async getGameByRobloxId(robloxId: string): Promise<Game | null> {
    try {
      // First try the `games` table directly (respect manual edits)
      const { data: gameData, error: gameError } = await supabase
        .from("games")
        .select("*")
        .eq("roblox_id", robloxId)
        .single();

      if (gameError) {
        console.warn("🎮 WARN: Error fetching from games table by roblox_id:", gameError);
      }

      if (gameData) return gameData as any;

      // Fallback to the view
      const { data, error } = await supabase
        .from("games_with_ratings")
        .select("*")
        .eq("roblox_id", robloxId)
        .eq("status", "approved")
        .single();

      if (error) {
        console.error("Error fetching game by Roblox ID from view:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in getGameByRobloxId:", error);
      return null;
    }
  }

  /**
   * Get game reviews with user info
   */
  static async getGameReviews(gameId: string): Promise<GameReview[]> {
    try {
      const { data, error } = await supabase
        .from("reviews_with_users")
        .select("*")
        .eq("game_id", gameId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getGameReviews:", error);
      return [];
    }
  }

  /**
   * Submit a rating and optional review for a game
   */
  static async submitRating(
    gameId: string,
    userId: string,
    ratings: {
      honesty: number;
      safety: number;
      fairness: number;
      age_appropriate: number;
    },
    review?: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Insert or update rating
      const { data: ratingData, error: ratingError } = await supabase
        .from("game_ratings")
        .upsert({
          game_id: gameId,
          user_id: userId,
          honesty: ratings.honesty,
          safety: ratings.safety,
          fairness: ratings.fairness,
          age_appropriate: ratings.age_appropriate,
        })
        .select()
        .single();

      if (ratingError) {
        console.error("Error submitting rating:", ratingError);
        return {
          success: false,
          message: "Failed to submit rating. Please try again.",
        };
      }

      // If review is provided, insert it
      if (review && review.trim().length >= 10) {
        const { error: reviewError } = await supabase
          .from("game_reviews")
          .insert({
            game_id: gameId,
            user_id: userId,
            rating_id: ratingData.id,
            content: review.trim(),
          });

        if (reviewError) {
          console.error("Error submitting review:", reviewError);
          // Don't fail if rating succeeded but review failed
          return {
            success: true,
            message:
              "Rating submitted successfully, but review failed to save.",
          };
        }
      }

      return {
        success: true,
        message: "Rating and review submitted successfully!",
      };
    } catch (error) {
      console.error("Error in submitRating:", error);
      return {
        success: false,
        message: "Failed to submit rating. Please try again.",
      };
    }
  }

  /**
   * Submit a report for a game
   */
  static async submitReport(
    gameId: string,
    userId: string,
    description: string,
    userEmail?: string,
    userName?: string,
    gameTitle?: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Insert report into database
      const { error } = await supabase.from("game_reports").insert({
        game_id: gameId,
        user_id: userId,
        description: description.trim(),
      });

      if (error) {
        console.error("Error submitting report:", error);
        return {
          success: false,
          message: "Failed to submit report. Please try again.",
        };
      }

      // Send email notification if user details are available
      if (userEmail && userName) {
        try {
          await EmailService.sendBugReport({
            userEmail,
            userName,
            gameId,
            gameTitle,
            description,
          });
        } catch (emailError) {
          console.error("Error sending report email:", emailError);
          // Don't fail the report submission if email fails
        }
      }

      return {
        success: true,
        message:
          "Report submitted successfully. Our team will review it shortly.",
      };
    } catch (error) {
      console.error("Error in submitReport:", error);
      return {
        success: false,
        message: "Failed to submit report. Please try again.",
      };
    }
  }

  /**
   * Submit a new game for approval
   */
  static async submitGame(
    robloxUrl: string,
    submitterId: string,
    userEmail?: string,
    userName?: string,
  ): Promise<{ success: boolean; message: string; submissionId?: string }> {
    try {
      // Validate Roblox URL
      if (!RobloxApiService.isValidRobloxUrl(robloxUrl)) {
        return {
          success: false,
          message: "Please provide a valid Roblox game URL.",
        };
      }

      const robloxId = RobloxApiService.extractGameId(robloxUrl);
      if (!robloxId) {
        return {
          success: false,
          message: "Could not extract game ID from URL.",
        };
      }

      // Check if game already exists
      const existingGame = await this.getGameByRobloxId(robloxId);
      if (existingGame) {
        return {
          success: false,
          message: "This game is already listed on Rotection.",
        };
      }

      // Check if there's already a pending submission
      const { data: existingSubmission } = await supabase
        .from("game_submissions")
        .select("id")
        .eq("roblox_id", robloxId)
        .eq("status", "pending")
        .single();

      if (existingSubmission) {
        return {
          success: false,
          message:
            "This game has already been submitted and is pending review.",
        };
      }

      // Fetch game data from Roblox
      const { gameInfo, thumbnail } =
        await RobloxApiService.getGameData(robloxUrl);

      // Insert submission
      const submissionData: Partial<GameSubmission> = {
        roblox_url: robloxUrl,
        roblox_id: robloxId,
        submitter_id: submitterId,
      };

      if (gameInfo) {
        submissionData.title = gameInfo.name;
        submissionData.developer = gameInfo.creator.name;
        submissionData.description = RobloxApiService.formatDescription(
          gameInfo.description,
        );
        submissionData.genre = gameInfo.genre;
      }

      if (thumbnail) {
        submissionData.thumbnail_url = thumbnail;
      }

      const { data, error } = await supabase
        .from("game_submissions")
        .insert(submissionData)
        .select()
        .single();

      if (error) {
        console.error("Error submitting game:", error);
        return {
          success: false,
          message: "Failed to submit game. Please try again.",
        };
      }

      // Send email notification
      if (userEmail && userName) {
        try {
          await EmailService.sendGameSubmission({
            userEmail,
            userName,
            gameUrl: robloxUrl,
            gameTitle: submissionData.title,
            developer: submissionData.developer,
            description: submissionData.description,
            genre: submissionData.genre,
            thumbnailUrl: submissionData.thumbnail_url,
          });
        } catch (emailError) {
          console.error("Error sending submission email:", emailError);
          // Don't fail the submission if email fails
        }
      }

      return {
        success: true,
        message:
          "Game submitted successfully! It will be reviewed by our team.",
        submissionId: data.id,
      };
    } catch (error) {
      console.error("Error in submitGame:", error);
      return {
        success: false,
        message: "Failed to submit game. Please try again.",
      };
    }
  }

  /**
   * Vote on review helpfulness
   */
  static async voteOnReview(
    reviewId: string,
    userId: string,
    isHelpful: boolean,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase.from("review_helpfulness").upsert({
        review_id: reviewId,
        user_id: userId,
        is_helpful: isHelpful,
      });

      if (error) {
        console.error("Error voting on review:", error);
        return { success: false, message: "Failed to record your vote." };
      }

      return { success: true, message: "Vote recorded successfully!" };
    } catch (error) {
      console.error("Error in voteOnReview:", error);
      return { success: false, message: "Failed to record your vote." };
    }
  }

  /**
   * Get featured/recommended games
   */
  static async getFeaturedGames(limit: number = 6): Promise<Game[]> {
    try {
      const { data, error } = await supabase
        .from("games_with_ratings")
        .select("*")
        .eq("status", "approved")
        .eq("verified", true)
        .gte("safety_score", 80)
        .order("avg_overall_rating", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching featured games:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getFeaturedGames:", error);
      return [];
    }
  }

  /**
   * Search games by title or developer
   */
  static async searchGames(query: string, limit: number = 20): Promise<Game[]> {
    if (!query.trim()) return [];

    try {
      const searchTerm = `%${query.trim()}%`;
      const { data, error } = await supabase
        .from("games_with_ratings")
        .select("*")
        .eq("status", "approved")
        .or(`title.ilike.${searchTerm},developer.ilike.${searchTerm}`)
        .order("rating_count", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error searching games:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in searchGames:", error);
      return [];
    }
  }

  /**
   * Get games by genre
   */
  static async getGamesByGenre(
    genre: string,
    limit: number = 20,
  ): Promise<Game[]> {
    try {
      const { data, error } = await supabase
        .from("games_with_ratings")
        .select("*")
        .eq("status", "approved")
        .eq("genre", genre)
        .order("rating_count", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("❌ DEBUG: Error fetching genres:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getGamesByGenre:", error);
      return [];
    }
  }

  /**
   * Get available genres from database
   */
  static async getGenres(): Promise<string[]> {
    try {
      console.log("🎮 DEBUG: GameService.getGenres called");

      const { data, error } = await supabase
        .from("games")
        .select("genre")
        .eq("status", "approved")
        .not("genre", "is", null);

      console.log(
        "🎮 DEBUG: getGenres query result - Data:",
        data?.length || 0,
      );
      console.log("🎮 DEBUG: getGenres query result - Error:", error);

      if (error) {
        console.error("Error fetching genres:", error);
        return ["All Genres"];
      }

      const genres = [...new Set(data?.map((g) => g.genre).filter(Boolean))];
      return ["All Genres", ...genres.sort()];
    } catch (error) {
      console.error("Error in getGenres:", error);
      return ["All Genres"];
    }
  }

  /**
   * Get user's rating for a specific game
   */
  static async getUserRating(
    gameId: string,
    userId: string,
  ): Promise<GameRating | null> {
    try {
      const { data, error } = await supabase
        .from("game_ratings")
        .select("*")
        .eq("game_id", gameId)
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user rating:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in getUserRating:", error);
      return null;
    }
  }

  /**
   * Check if user has voted on a review
   */
  static async getUserReviewVote(
    reviewId: string,
    userId: string,
  ): Promise<boolean | null> {
    try {
      const { data, error } = await supabase
        .from("review_helpfulness")
        .select("is_helpful")
        .eq("review_id", reviewId)
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user review vote:", error);
        return null;
      }

      return data?.is_helpful || null;
    } catch (error) {
      console.error("Error in getUserReviewVote:", error);
      return null;
    }
  }

  /**
   * Get user's submissions
   */
  static async getUserSubmissions(userId: string): Promise<GameSubmission[]> {
    try {
      const { data, error } = await supabase
        .from("game_submissions")
        .select("*")
        .eq("submitter_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching user submissions:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getUserSubmissions:", error);
      return [];
    }
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
   * Refresh Roblox metadata (thumbnail and total plays) for a game by roblox_id
   */
  static async refreshRobloxMetadata(
    robloxId: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      if (!robloxId) return { success: false, message: "No robloxId provided" };

      console.log("🎮 INFO: refreshRobloxMetadata called for", robloxId);

      const [gameInfo, thumbnail] = await Promise.all([
        RobloxApiService.fetchGameInfo(robloxId),
        RobloxApiService.fetchGameThumbnail(robloxId),
      ]);

      const updates: Record<string, any> = {};
      if (thumbnail) updates.thumbnail_url = thumbnail;
      if (gameInfo && typeof gameInfo.visits === "number") {
        updates.total_plays = String(gameInfo.visits);
      }

      if (Object.keys(updates).length === 0) {
        console.warn("🎮 WARN: Nothing to update for", robloxId);
        return { success: false, message: "No fields to update" };
      }

      const { data, error } = await supabase
        .from("games")
        .update(updates)
        .eq("roblox_id", robloxId)
        .select();

      if (error) {
        console.error("❌ ERROR: Supabase update failed for", robloxId, error);
        return { success: false, message: error.message || "Update failed" };
      }

      console.log(
        "✅ INFO: Successfully refreshed Roblox metadata for",
        robloxId,
        "rowsAffected:",
        Array.isArray(data) ? data.length : data ? 1 : 0,
      );

      return { success: true, message: "Metadata refreshed" };
    } catch (err) {
      console.error("❌ ERROR: Exception in refreshRobloxMetadata for", robloxId, err);
      return { success: false, message: String(err) };
    }
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

  /**
   * Format visit count for display
   */
  static formatVisitCount(visits: string | number): string {
    const numVisits =
      typeof visits === "string"
        ? parseInt(visits.replace(/[^\d]/g, ""))
        : visits;

    if (isNaN(numVisits)) return visits.toString();

    if (numVisits >= 1000000000) {
      return (numVisits / 1000000000).toFixed(1) + "B+";
    } else if (numVisits >= 1000000) {
      return (numVisits / 1000000).toFixed(1) + "M+";
    } else if (numVisits >= 1000) {
      return (numVisits / 1000).toFixed(1) + "K+";
    } else {
      return numVisits.toString();
    }
  }
}

export default GameService;
