import { useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@shared/schema";

export default function RecentlyGenerated() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts/recent"],
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  if (isLoading) {
    return (
      <div className="mt-12">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Recently Generated</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded mb-3"></div>
                <div className="flex justify-between">
                  <div className="h-2 bg-slate-200 rounded w-16"></div>
                  <div className="h-2 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Recently Generated</h3>
          <button className="text-primary-600 text-sm font-medium hover:text-primary-700">View All</button>
        </div>
        
        {!posts || posts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-file-alt text-slate-400"></i>
            </div>
            <p className="text-slate-600 text-sm">No blog posts generated yet.</p>
            <p className="text-slate-500 text-xs mt-1">Your recently generated content will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <h4 className="font-medium text-slate-900 mb-2 line-clamp-2">{post.title}</h4>
                <p className="text-sm text-slate-600 mb-3 line-clamp-3">
                  {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{formatTimeAgo(post.createdAt)}</span>
                  <span>{post.wordCount} words</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
