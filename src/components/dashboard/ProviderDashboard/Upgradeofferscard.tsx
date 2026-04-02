"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Star, Target, ArrowUpRight } from "lucide-react";

interface UpgradeOffersCardProps {
  isPro?: boolean;
}

export function UpgradeOffersCard({ isPro = false }: UpgradeOffersCardProps) {
  return (
    <Card className="border-slate-200  dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Upgrade & Offers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
                {isPro ? (
                  <div className="relative group overflow-hidden rounded-xl border-2 border-amber-400/50 bg-gradient-to-br from-yellow-50 to-yellow-50 dark:from-yellow-950/30 dark:to-yellow-950/30 p-4 hover:border-yellow-400 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl" />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500 dark:text-yellow-400 fill-current" />
                          <h3 className="font-bold text-slate-900 dark:text-white">
                            Taskoria PRO Actived
                          </h3>
                        </div>
                        <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
                          Actived
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        You have access to priority support, weekly free leads & exclusive features.
                      </p>
                      <div className="flex items-center gap-3">
                        <Link href="/settings/billing/taskoria_pro" className="flex-1">
                          <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-slate-200 font-semibold shadow-lg">
                            Manage Billing
                          </Button>
                        </Link>
                        <Link href="/settings/billing/unsubscription" className="flex-none">
                          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30 font-medium whitespace-nowrap">
                            Cancel Plan
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative group overflow-hidden rounded-xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 p-4 hover:border-amber-400 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl" />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-amber-600 dark:text-amber-400 fill-current" />
                          <h3 className="font-bold text-slate-900 dark:text-white">
                            Taskoria PRO
                          </h3>
                        </div>
                        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0">
                          Popular
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Verified badge, priority support, weekly free leads &
                        exclusive features
                      </p>
                      <Link href="/settings/billing/taskoria_pro">
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-semibold shadow-lg shadow-amber-500/20">
                          Upgrade to PRO
                          <ArrowUpRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                <div className="relative group overflow-hidden rounded-xl border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        Starter Pack
                      </h3>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-blue-600 text-white"
                    >
                      20% OFF
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Respond to 10 customers & boost your credibility
                  </p>
                  <Link href="/settings/billing/my_credits">
                    <Button
                      variant="outline"
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 font-semibold"
                    >
                      Get Started
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
    </Card>
  );
}