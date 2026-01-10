import { pgTable, text, varchar, boolean, integer, decimal, timestamp, uuid, unique, index, pgView } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().unique(),
  username: text("username").notNull().unique(),
  provider: text("provider"),
  robloxUserId: text("roblox_user_id"),
  robloxUsername: text("roblox_username"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const games = pgTable("games", {
  id: uuid("id").defaultRandom().primaryKey(),
  robloxId: text("roblox_id").notNull().unique(),
  title: text("title").notNull(),
  developer: text("developer").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  robloxUrl: text("roblox_url").notNull(),
  genre: text("genre"),
  ageRating: text("age_rating").default("7+"),
  verified: boolean("verified").default(false),
  status: text("status").default("pending"),
  totalPlays: text("total_plays").default("0"),
  submittedBy: uuid("submitted_by"),
  approvedBy: uuid("approved_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("games_roblox_id_idx").on(table.robloxId),
  index("games_status_idx").on(table.status),
  index("games_genre_idx").on(table.genre),
  index("games_verified_idx").on(table.verified),
]);

export const gameRatings = pgTable("game_ratings", {
  id: uuid("id").defaultRandom().primaryKey(),
  gameId: uuid("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(),
  honesty: integer("honesty").notNull(),
  safety: integer("safety").notNull(),
  fairness: integer("fairness").notNull(),
  ageAppropriate: integer("age_appropriate").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  unique("game_ratings_game_user_unique").on(table.gameId, table.userId),
  index("game_ratings_game_id_idx").on(table.gameId),
  index("game_ratings_user_id_idx").on(table.userId),
]);

export const gameReviews = pgTable("game_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  gameId: uuid("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(),
  ratingId: uuid("rating_id").references(() => gameRatings.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  helpfulCount: integer("helpful_count").default(0),
  unhelpfulCount: integer("unhelpful_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("game_reviews_game_id_idx").on(table.gameId),
  index("game_reviews_user_id_idx").on(table.userId),
]);

export const reviewHelpfulness = pgTable("review_helpfulness", {
  id: uuid("id").defaultRandom().primaryKey(),
  reviewId: uuid("review_id").notNull().references(() => gameReviews.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(),
  isHelpful: boolean("is_helpful").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  unique("review_helpfulness_review_user_unique").on(table.reviewId, table.userId),
]);

export const gameReports = pgTable("game_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  gameId: uuid("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(),
  description: text("description").notNull(),
  status: text("status").default("pending"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("game_reports_game_id_idx").on(table.gameId),
  index("game_reports_status_idx").on(table.status),
]);

export const gameSubmissions = pgTable("game_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  robloxUrl: text("roblox_url").notNull(),
  robloxId: text("roblox_id"),
  title: text("title"),
  developer: text("developer"),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  genre: text("genre"),
  submitterId: uuid("submitter_id").notNull(),
  status: text("status").default("pending"),
  adminNotes: text("admin_notes"),
  reviewedBy: uuid("reviewed_by"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("game_submissions_status_idx").on(table.status),
  index("game_submissions_submitter_idx").on(table.submitterId),
]);

export const sessions = pgTable("sessions", {
  sid: varchar("sid", { length: 255 }).primaryKey(),
  sess: text("sess").notNull(),
  expire: timestamp("expire", { withTimezone: true }).notNull(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGameRatingSchema = createInsertSchema(gameRatings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGameReviewSchema = createInsertSchema(gameReviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  helpfulCount: true,
  unhelpfulCount: true,
});

export const insertGameReportSchema = createInsertSchema(gameReports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  adminNotes: true,
});

export const insertGameSubmissionSchema = createInsertSchema(gameSubmissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  adminNotes: true,
  reviewedBy: true,
  reviewedAt: true,
});

export const insertReviewHelpfulnessSchema = createInsertSchema(reviewHelpfulness).omit({
  id: true,
  createdAt: true,
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type InsertGameRating = z.infer<typeof insertGameRatingSchema>;
export type InsertGameReview = z.infer<typeof insertGameReviewSchema>;
export type InsertGameReport = z.infer<typeof insertGameReportSchema>;
export type InsertGameSubmission = z.infer<typeof insertGameSubmissionSchema>;
export type InsertReviewHelpfulness = z.infer<typeof insertReviewHelpfulnessSchema>;

export type Profile = typeof profiles.$inferSelect;
export type Game = typeof games.$inferSelect;
export type GameRating = typeof gameRatings.$inferSelect;
export type GameReview = typeof gameReviews.$inferSelect;
export type GameReport = typeof gameReports.$inferSelect;
export type GameSubmission = typeof gameSubmissions.$inferSelect;
export type ReviewHelpfulness = typeof reviewHelpfulness.$inferSelect;

export interface GameWithRatings extends Game {
  avgHonesty: number;
  avgSafety: number;
  avgFairness: number;
  avgAgeAppropriate: number;
  avgOverallRating: number;
  ratingCount: number;
  safetyScore: number;
}

export interface ReviewWithUser extends GameReview {
  authorUsername: string;
  rating: number | null;
}
