import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { generateContentSchema, type GenerateContentRequest } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { GeneratedContent } from "@/pages/blog-generator";

interface InputPanelProps {
  onGenerate: (content: GeneratedContent) => void;
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
}

export default function InputPanel({ onGenerate, isGenerating, setIsGenerating }: InputPanelProps) {
  const { toast } = useToast();
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);

  const form = useForm<GenerateContentRequest>({
    resolver: zodResolver(generateContentSchema),
    defaultValues: {
      topic: "",
      keywords: "",
      contentLength: "medium",
      writingTone: "conversational",
      targetAudience: "business",
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateContentRequest) => {
      const response = await apiRequest("POST", "/api/generate", data);
      return response.json();
    },
    onMutate: () => {
      setIsGenerating(true);
    },
    onSuccess: (data: GeneratedContent) => {
      onGenerate(data);
      toast({
        title: "Success!",
        description: "Your blog post has been generated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  const topicSuggestionsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/topic-suggestions", {});
      return response.json();
    },
    onSuccess: (data: { suggestions: string[] }) => {
      // For now, just show the first suggestion in the topic field
      if (data.suggestions.length > 0) {
        form.setValue("topic", data.suggestions[0]);
        toast({
          title: "Topic Suggestion",
          description: `Try: "${data.suggestions[0]}"`,
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate topic suggestions.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GenerateContentRequest) => {
    generateMutation.mutate(data);
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Create Your Blog Post</h2>
          <p className="text-sm text-slate-600">Enter your topic and let AI generate engaging content for you.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blog Topic</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Benefits of Remote Work, AI in Healthcare..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="productivity, technology, innovation"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contentLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Length</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content length" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="short">Short (300-500 words)</SelectItem>
                      <SelectItem value="medium">Medium (500-800 words)</SelectItem>
                      <SelectItem value="long">Long (800-1200 words)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="writingTone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Writing Tone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select writing tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target audience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General Public</SelectItem>
                      <SelectItem value="business">Business Professionals</SelectItem>
                      <SelectItem value="technical">Technical Experts</SelectItem>
                      <SelectItem value="students">Students</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6 space-y-3">
              <Button 
                type="submit"
                className="w-full"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic mr-2"></i>
                    Generate Blog Post
                  </>
                )}
              </Button>
              
              <Button 
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => topicSuggestionsMutation.mutate()}
                disabled={topicSuggestionsMutation.isPending}
              >
                <i className="fas fa-lightbulb mr-2"></i>
                {topicSuggestionsMutation.isPending ? "Loading..." : "Get Topic Suggestions"}
              </Button>
            </div>
          </form>
        </Form>

        {isGenerating && (
          <div className="mt-4">
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-3"></div>
                <span className="text-sm text-primary-700 font-medium">AI is crafting your blog post...</span>
              </div>
              <div className="mt-2 bg-primary-200 rounded-full h-1">
                <div className="bg-primary-600 h-1 rounded-full w-1/3 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
