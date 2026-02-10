"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ArrowRight } from "lucide-react";

type ResponsesCardProps = {
  totalResponse: number;
};

export function ResponsesCard({ totalResponse }: ResponsesCardProps) {
  return (
    <Link href="/provider-responses" className="block group">
      <Card className="border-2 rounded-2xl shadow-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-500/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Responses
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              {totalResponse === 0 ? (
                <>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    You haven’t responded yet
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Start responding to tasks to build your activity.{" "}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {totalResponse}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Responses sent
                  </p>
                </>
              )}
            </div>

            <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center group-hover:scale-105 transition">
              <MessageSquare className="w-7 h-7 text-blue-500 dark:text-blue-400" />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all">
            View my responses
            <ArrowRight className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
