import { useQuery } from "@tanstack/react-query";

export default function UsageStats() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">Words Generated Today</p>
            <p className="text-2xl font-bold text-slate-900">
              {stats?.wordsGenerated?.toLocaleString() || 0}
            </p>
          </div>
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-file-alt text-primary-600"></i>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">Articles Created</p>
            <p className="text-2xl font-bold text-slate-900">
              {stats?.articlesCreated || 0}
            </p>
          </div>
          <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-check-circle text-success-600"></i>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">Time Saved</p>
            <p className="text-2xl font-bold text-slate-900">
              {stats?.timeSaved || "0h"}
            </p>
          </div>
          <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-clock text-accent-600"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
