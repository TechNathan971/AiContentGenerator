import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export interface GeneratedContent {
  title: string;
  content: string;
  featuredImageDescription: string;
  seoScore: number;
  wordCount: number;
  readingTime: number;
  seoSuggestions: string[];
}

export async function generateBlogPost(
  topic: string,
  keywords: string = "",
  contentLength: string,
  writingTone: string,
  targetAudience: string
): Promise<GeneratedContent> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const wordTargets = {
      short: "300-500",
      medium: "500-800",
      long: "800-1200"
    };

    const prompt = `Create a comprehensive blog post with the following specifications:

Topic: ${topic}
Keywords: ${keywords || "None specified"}
Target word count: ${wordTargets[contentLength as keyof typeof wordTargets]} words
Writing tone: ${writingTone}
Target audience: ${targetAudience}

Please provide a response in JSON format with the following structure:
{
  "title": "An engaging, SEO-optimized title",
  "content": "Full blog post content in HTML format with proper headings (h2, h3), paragraphs, and formatting. Include engaging introduction, well-structured body with subheadings, and compelling conclusion.",
  "featuredImageDescription": "Detailed description for a featured image that would complement this blog post",
  "seoSuggestions": ["Array of 3-5 specific SEO improvement suggestions"],
  "wordCount": "Estimated word count as a number"
}

Requirements:
- Use proper HTML formatting for the content
- Include relevant subheadings (h2, h3 tags)
- Write in ${writingTone} tone for ${targetAudience} audience
- Naturally incorporate keywords: ${keywords}
- Make content engaging and informative
- Ensure content is original and valuable
- Include a compelling introduction and conclusion
- Add relevant examples or case studies if applicable

Respond only with valid JSON, no other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response to ensure it's valid JSON
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsedResult = JSON.parse(cleanedText);
    
    // Calculate reading time (average 200 words per minute)
    const readingTime = Math.ceil(parsedResult.wordCount / 200);
    
    // Calculate SEO score based on various factors
    const seoScore = calculateSeoScore(parsedResult.title, parsedResult.content, keywords);

    return {
      title: parsedResult.title || "Generated Blog Post",
      content: parsedResult.content || "",
      featuredImageDescription: parsedResult.featuredImageDescription || "Professional blog post illustration",
      seoScore,
      wordCount: parsedResult.wordCount || 0,
      readingTime,
      seoSuggestions: parsedResult.seoSuggestions || []
    };

  } catch (error) {
    console.error("Google AI API Error:", error);
    throw new Error("Failed to generate content. Please check your API key and try again.");
  }
}

function calculateSeoScore(title: string, content: string, keywords: string): number {
  let score = 60; // Base score
  
  // Check title length (50-60 characters ideal)
  if (title.length >= 50 && title.length <= 60) score += 10;
  else if (title.length >= 40 && title.length <= 70) score += 5;
  
  // Check for keywords in title
  if (keywords) {
    const keywordList = keywords.toLowerCase().split(',').map(k => k.trim());
    const titleLower = title.toLowerCase();
    if (keywordList.some(keyword => titleLower.includes(keyword))) score += 10;
  }
  
  // Check content structure (presence of headings)
  if (content.includes('<h2>') || content.includes('<h3>')) score += 10;
  
  // Check content length
  const wordCount = content.split(' ').length;
  if (wordCount >= 300) score += 10;
  
  return Math.min(100, score);
}

export async function generateTopicSuggestions(theme: string = ""): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate 10 engaging blog post topic suggestions${theme ? ` related to: ${theme}` : " for various industries and interests"}. 
    
    Please provide a response in JSON format:
    {
      "topics": ["Topic 1", "Topic 2", "Topic 3", ...]
    }
    
    Make sure topics are:
    - Specific and actionable
    - SEO-friendly
    - Engaging for readers
    - Relevant to current trends
    
    Respond only with valid JSON, no other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response to ensure it's valid JSON
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsedResult = JSON.parse(cleanedText);
    return parsedResult.topics || [];

  } catch (error) {
    console.error("Error generating topic suggestions:", error);
    throw new Error("Failed to generate topic suggestions");
  }
}
