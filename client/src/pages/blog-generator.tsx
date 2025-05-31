import { useState } from "react";
import Header from "@/components/header";
import InputPanel from "@/components/input-panel";
import ContentDisplay from "@/components/content-display";
import UsageStats from "@/components/usage-stats";
import RecentlyGenerated from "@/components/recently-generated";

export interface GeneratedContent {
  id?: number;
  title: string;
  content: string;
  featuredImageDescription: string;
  seoScore: number;
  wordCount: number;
  readingTime: number;
  seoSuggestions: string[];
}

export default function BlogGenerator() {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <InputPanel 
            onGenerate={setGeneratedContent}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
          <div className="lg:col-span-2">
            <ContentDisplay 
              generatedContent={generatedContent}
              setGeneratedContent={setGeneratedContent}
            />
            <UsageStats />
          </div>
        </div>
        
        <RecentlyGenerated />
      </main>

      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-robot text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Blog Generator</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Google Gemini</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 max-w-md">
                Create engaging, SEO-optimized blog posts in minutes with advanced AI technology. 
                Perfect for content creators, marketers, and businesses.
              </p>
              <div className="flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-400">
                <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">API Documentation</a>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-right">
                <p className="text-sm text-slate-600 dark:text-slate-400">Developed by</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">Engr. Nathanael</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">ZenithTech Systems</p>
              </div>
              <div className="text-right border-t border-slate-200 dark:border-slate-600 pt-4">
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  © 2024 AI Blog Generator. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
