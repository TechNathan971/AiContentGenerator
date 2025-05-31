import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  topic: text("topic").notNull(),
  keywords: text("keywords"),
  contentLength: text("content_length").notNull(),
  writingTone: text("writing_tone").notNull(),
  targetAudience: text("target_audience").notNull(),
  wordCount: integer("word_count").notNull(),
  seoScore: integer("seo_score"),
  featuredImageDescription: text("featured_image_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
});

export const generateContentSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  keywords: z.string().optional(),
  contentLength: z.enum(["short", "medium", "long"]),
  writingTone: z.enum(["professional", "conversational", "academic", "creative"]),
  targetAudience: z.enum(["general", "business", "technical", "students"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type GenerateContentRequest = z.infer<typeof generateContentSchema>;
