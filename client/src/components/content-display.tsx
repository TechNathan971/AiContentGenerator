import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { GeneratedContent } from "@/pages/blog-generator";

interface ContentDisplayProps {
  generatedContent: GeneratedContent | null;
  setGeneratedContent: (content: GeneratedContent | null) => void;
}

export default function ContentDisplay({ generatedContent, setGeneratedContent }: ContentDisplayProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  const handleEdit = () => {
    if (generatedContent) {
      setEditedTitle(generatedContent.title);
      setEditedContent(generatedContent.content);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (generatedContent) {
      setGeneratedContent({
        ...generatedContent,
        title: editedTitle,
        content: editedContent,
      });
      setIsEditing(false);
      toast({
        title: "Changes Saved",
        description: "Your content has been updated successfully.",
      });
    }
  };

  const handleCopy = async () => {
    if (generatedContent) {
      try {
        const textContent = `${generatedContent.title}\n\n${generatedContent.content.replace(/<[^>]*>/g, '')}`;
        await navigator.clipboard.writeText(textContent);
        toast({
          title: "Copied!",
          description: "Content copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Failed to copy content to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  const handleExport = () => {
    if (generatedContent) {
      const markdown = `# ${generatedContent.title}\n\n${generatedContent.content.replace(/<[^>]*>/g, '')}`;
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedContent.title.toLowerCase().replace(/\s+/g, '-')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Exported!",
        description: "Content exported as Markdown file.",
      });
    }
  };

  const handleRegenerate = () => {
    setGeneratedContent(null);
    toast({
      title: "Ready to Generate",
      description: "Fill in the form to generate new content.",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Generated Content</h3>
            <p className="text-sm text-slate-600 mt-1">Your AI-generated blog post will appear here</p>
          </div>
          {generatedContent && (
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleRegenerate}
                title="Regenerate"
              >
                <i className="fas fa-redo text-sm"></i>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleExport}
                title="Export"
              >
                <i className="fas fa-download text-sm"></i>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCopy}
                title="Copy"
              >
                <i className="fas fa-copy text-sm"></i>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {!generatedContent ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-edit text-slate-400 text-2xl"></i>
            </div>
            <h4 className="text-lg font-medium text-slate-900 mb-2">Ready to Create Amazing Content?</h4>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">Fill in the form on the left and click "Generate Blog Post" to create your AI-powered content.</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">AI Writing</span>
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">SEO Optimized</span>
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">Instant Results</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              {isEditing ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-2xl font-bold border-none p-0 focus:ring-0 bg-transparent"
                />
              ) : (
                <h1 className="text-2xl font-bold text-slate-900">{generatedContent.title}</h1>
              )}
              <div className="flex items-center space-x-4 mt-3 text-sm text-slate-600">
                <span><i className="fas fa-clock mr-1"></i>{generatedContent.readingTime} min read</span>
                <span><i className="fas fa-chart-line mr-1"></i>SEO Score: {generatedContent.seoScore}/100</span>
                <span><i className="fas fa-eye mr-1"></i>{generatedContent.wordCount} words</span>
              </div>
            </div>

            {generatedContent.featuredImageDescription && (
              <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-image text-white text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-slate-900 mb-1">Suggested Featured Image</h5>
                    <p className="text-sm text-slate-600 mb-2">"{generatedContent.featuredImageDescription}"</p>
                    <button className="text-accent-600 text-sm font-medium hover:text-accent-700">
                      <i className="fas fa-external-link-alt mr-1"></i>Generate Image
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="prose max-w-none">
              {isEditing ? (
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-96 text-slate-700 leading-relaxed"
                />
              ) : (
                <div 
                  className="text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: generatedContent.content }}
                />
              )}
            </div>

            {generatedContent.seoSuggestions && generatedContent.seoSuggestions.length > 0 && (
              <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                <h5 className="font-medium text-slate-900 mb-2 flex items-center">
                  <i className="fas fa-search text-success-600 mr-2"></i>
                  SEO Optimization Suggestions
                </h5>
                <ul className="text-sm text-slate-700 space-y-1">
                  {generatedContent.seoSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-center">
                      <i className="fas fa-lightbulb text-success-600 mr-2 text-xs"></i>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
              <Button onClick={isEditing ? handleSaveEdit : handleEdit}>
                <i className={`fas ${isEditing ? 'fa-save' : 'fa-edit'} mr-2`}></i>
                {isEditing ? 'Save Changes' : 'Edit Content'}
              </Button>
              {isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              )}
              <Button variant="secondary" onClick={handleExport}>
                <i className="fas fa-file-export mr-2"></i>Export as Markdown
              </Button>
              <Button variant="outline" onClick={handleCopy}>
                <i className="fas fa-copy mr-2"></i>Copy Content
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
