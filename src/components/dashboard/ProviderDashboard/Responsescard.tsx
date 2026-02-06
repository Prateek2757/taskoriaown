"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ResponsesCard() {
  return (
    <Card className="border rounded-2xl shadow-lg bg-white/80 dark:bg-white/5 border-gray-200 dark:border-white/10">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg font-semibold dark:text-white">
          Responses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-center text-slate-500 dark:text-slate-400 py-8">
          You haven't responded to any leads yet.
        </p>
      </CardContent>
    </Card>
  );
}