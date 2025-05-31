import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import { Upload, Image as ImageIcon } from "lucide-react";

const socialMediaSchema = z.object({
  platform: z.enum(["tiktok", "facebook", "instagram", "twitter"]),
  tone: z.enum(["casual", "professional", "playful", "inspirational"]),
  includeHashtags: z.boolean().default(true),
});

type SocialMediaRequest = z.infer<typeof socialMediaSchema>;

interface GeneratedPost {
  caption: string;
  hashtags: string[];
  platform: string;
  engagement_tips: string[];
}

export default function SocialMediaGenerator() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<SocialMediaRequest>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      platform: "tiktok",
      tone: "casual",
      includeHashtags: true,
    },
  });

  const generatePostMutation = useMutation({
    mutationFn: async (data: SocialMediaRequest & { imageBase64: string }) => {
      const response = await apiRequest("POST", "/api/generate-social-post", data);
      return response.json();
    },
    onMutate: () => {
      setIsGenerating(true);
    },
    onSuccess: (data: GeneratedPost) => {
      setGeneratedPost(data);
      toast({
        title: "Success!",
        description: "Your social media post has been generated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate post. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: SocialMediaRequest) => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image to generate a social media post.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      generatePostMutation.mutate({
        ...data,
        imageBase64: base64,
      });
    };
    reader.readAsDataURL(selectedImage);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Social Media Post Generator</h1>
          <p className="text-slate-600 dark:text-slate-400">Upload an image and generate engaging social media posts with AI-powered captions and hashtags.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Upload Image</h2>
              
              <div 
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="space-y-4">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-full max-h-64 mx-auto rounded-lg object-cover"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 font-medium">Click to upload an image</p>
                      <p className="text-sm text-slate-500 dark:text-slate-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Post Settings</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="playful">Playful</SelectItem>
                            <SelectItem value="inspirational">Inspirational</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit"
                    className="w-full"
                    disabled={isGenerating || !selectedImage}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Generate Post
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="border-b border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Generated Post</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Your AI-generated social media post will appear here</p>
            </div>

            <div className="p-6">
              {!generatedPost ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Ready to Create Viral Content?</h4>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">Upload an image and select your platform to generate engaging social media posts with AI.</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm">AI Captions</span>
                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm">Smart Hashtags</span>
                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm">Platform Optimized</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-slate-900 dark:text-white">Caption</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCopy(generatedPost.caption)}
                      >
                        <i className="fas fa-copy text-sm mr-1"></i>
                        Copy
                      </Button>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{generatedPost.caption}</p>
                    </div>
                  </div>

                  {generatedPost.hashtags && generatedPost.hashtags.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-slate-900 dark:text-white">Hashtags</h4>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCopy(generatedPost.hashtags.join(' '))}
                        >
                          <i className="fas fa-copy text-sm mr-1"></i>
                          Copy
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {generatedPost.hashtags.map((hashtag, index) => (
                          <span 
                            key={index}
                            className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded text-sm"
                          >
                            #{hashtag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {generatedPost.engagement_tips && generatedPost.engagement_tips.length > 0 && (
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-3">Engagement Tips</h4>
                      <ul className="space-y-2">
                        {generatedPost.engagement_tips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <i className="fas fa-lightbulb text-yellow-500 mr-2 mt-0.5 text-sm"></i>
                            <span className="text-sm text-slate-700 dark:text-slate-300">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
                    <Button 
                      onClick={() => handleCopy(`${generatedPost.caption}\n\n${generatedPost.hashtags.join(' ')}`)}
                      className="w-full"
                    >
                      <i className="fas fa-copy mr-2"></i>
                      Copy Complete Post
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}