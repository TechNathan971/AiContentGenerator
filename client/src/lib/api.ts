import { apiRequest } from "./queryClient";
import type { GenerateContentRequest } from "@shared/schema";

export async function generateBlogPost(data: GenerateContentRequest) {
  const response = await apiRequest("POST", "/api/generate", data);
  return response.json();
}

export async function getTopicSuggestions(theme?: string) {
  const response = await apiRequest("POST", "/api/topic-suggestions", { theme });
  return response.json();
}

export async function getRecentBlogPosts(limit = 6) {
  const response = await apiRequest("GET", `/api/blog-posts/recent?limit=${limit}`);
  return response.json();
}

export async function getBlogPost(id: number) {
  const response = await apiRequest("GET", `/api/blog-posts/${id}`);
  return response.json();
}

export async function updateBlogPost(id: number, updates: any) {
  const response = await apiRequest("PATCH", `/api/blog-posts/${id}`, updates);
  return response.json();
}

export async function getUsageStats() {
  const response = await apiRequest("GET", "/api/stats");
  return response.json();
}
