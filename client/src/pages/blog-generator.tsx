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
    <div className="min-h-screen bg-slate-50">
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

      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-600 to-accent-600 rounded"></div>
              <span className="text-slate-600 text-sm">© 2024 AI Blog Generator. Powered by Google Gemini.</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-600">
              <a href="#" className="hover:text-slate-900">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900">Terms of Service</a>
              <a href="#" className="hover:text-slate-900">API Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
