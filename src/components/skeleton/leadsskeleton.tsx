export default function LeadSkeleton() {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-[#0d1117] animate-pulse">
        <div className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0d1117] flex flex-col">
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-32" />
            <div className="h-9 bg-gray-100 dark:bg-gray-800 rounded-xl" />
            <div className="flex gap-2">
              {[60, 44, 72, 80].map((w) => (
                <div key={w} className="h-7 bg-gray-100 dark:bg-gray-800 rounded-lg" style={{ width: w }} />
              ))}
            </div>
          </div>
          <div className="flex-1 divide-y divide-gray-100 dark:divide-gray-800">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-4 py-3.5 flex gap-3">
                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-10" />
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-32" />
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
  
        <div className="flex-1 flex flex-col bg-white dark:bg-[#0d1117]">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex gap-3 items-center">
            <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-36" />
              <div className="h-3.5 bg-gray-100 dark:bg-gray-800 rounded w-24" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full" style={{ width: `${85 - i * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  