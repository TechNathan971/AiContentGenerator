import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateContentSchema } from "@shared/schema";
import { generateBlogPost, generateTopicSuggestions } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate blog post content
  app.post("/api/generate", async (req, res) => {
    try {
      const validatedData = generateContentSchema.parse(req.body);
      
      const generatedContent = await generateBlogPost(
        validatedData.topic,
        validatedData.keywords,
        validatedData.contentLength,
        validatedData.writingTone,
        validatedData.targetAudience
      );

      // Save to storage
      const blogPost = await storage.createBlogPost({
        userId: null, // No user system for now
        title: generatedContent.title,
        content: generatedContent.content,
        topic: validatedData.topic,
        keywords: validatedData.keywords || "",
        contentLength: validatedData.contentLength,
        writingTone: validatedData.writingTone,
        targetAudience: validatedData.targetAudience,
        wordCount: generatedContent.wordCount,
        seoScore: generatedContent.seoScore,
        featuredImageDescription: generatedContent.featuredImageDescription,
      });

      res.json({
        ...generatedContent,
        id: blogPost.id,
      });
    } catch (error) {
      console.error("Generate content error:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to generate content" 
      });
    }
  });

  // Get topic suggestions
  app.post("/api/topic-suggestions", async (req, res) => {
    try {
      const { theme } = req.body;
      const suggestions = await generateTopicSuggestions(theme);
      res.json({ suggestions });
    } catch (error) {
      console.error("Topic suggestions error:", error);
      res.status(500).json({ 
        message: "Failed to generate topic suggestions" 
      });
    }
  });

  // Get recent blog posts
  app.get("/api/blog-posts/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const posts = await storage.getRecentBlogPosts(limit);
      res.json(posts);
    } catch (error) {
      console.error("Get recent posts error:", error);
      res.status(500).json({ message: "Failed to fetch recent posts" });
    }
  });

  // Get blog post by ID
  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Get blog post error:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Update blog post
  app.patch("/api/blog-posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedPost = await storage.updateBlogPost(id, updates);
      
      if (!updatedPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(updatedPost);
    } catch (error) {
      console.error("Update blog post error:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  // Delete blog post
  app.delete("/api/blog-posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBlogPost(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Delete blog post error:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Get usage statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const todaysWordCount = await storage.getTodaysWordCount();
      const todaysArticleCount = await storage.getTodaysArticleCount();
      
      // Calculate time saved (assuming 1 hour per 500 words manually)
      const timeSaved = Math.round((todaysWordCount / 500) * 10) / 10;
      
      res.json({
        wordsGenerated: todaysWordCount,
        articlesCreated: todaysArticleCount,
        timeSaved: `${timeSaved}h`
      });
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
