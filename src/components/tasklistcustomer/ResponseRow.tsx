"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Star, MapPin, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ResponsesRow({
  responses,
  loading,
}: {
  responses: any[] | undefined;
  loading: boolean;
}) {
  const router = useRouter();

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading responses...</p>
        </div>
      </div>
    );

  if (!responses?.length)
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">No responses yet</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Be patient, proposals will arrive soon</p>
      </div>
    );

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Proposals ({responses.length})
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Review and connect with candidates</p>
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
          {responses.map((r: any, idx: number) => (
            <motion.div
              key={r.response_id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.3 }}
            >
              <Card className="group min-w-[340px] max-w-[340px] p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-1">
                
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={r.avatar_url || "/images/default-avatar.png"}
                      className="w-14 h-14 rounded-xl object-cover ring-2 ring-gray-100 dark:ring-gray-700 group-hover:ring-blue-500 dark:group-hover:ring-blue-400 transition-all"
                      alt={r.display_name}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {r.display_name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {r.profile_title || "Professional"}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {r.rating || "5.0"}
                        </span>
                      </div>
                      
                      {r.completed_jobs && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{r.completed_jobs} jobs</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {r.skills && r.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {r.skills.slice(0, 3).map((skill: string, i: number) => (
                      <Badge 
                        key={i} 
                        variant="secondary" 
                        className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="mb-5">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                    {r.title || r.message || "Interested in working on your project. Let's discuss the details."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-5 pb-5 border-b border-gray-100 dark:border-gray-700">
                  {r.location && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{r.location}</span>
                    </div>
                  )}
                  
                  {r.response_time && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{r.response_time}</span>
                    </div>
                  )}

                  {r.success_rate && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{r.success_rate}% success</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2.5">
                  <Button
                    className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm hover:shadow transition-all"
                    onClick={() => router.push(`/messages/${r.id}`)}
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Message
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-xl px-4 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all"
                    onClick={() => router.push(`/message/${r.id}`)}
                    title="View Profile"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {responses.length > 3 && (
          <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
        )}
      </div>
    </div>
  );
}