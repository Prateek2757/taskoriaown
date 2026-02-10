"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Check, ArrowLeft, Sparkles, TrendingUp, Shield, Zap, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  useProfessionalPackages,
  type ProfessionalPackage,
} from "@/hooks/useProfessionalPackage";
import axios from "axios";

export default function TaskoriaProPage() {
  const router = useRouter();
  const { packages, isLoading, hasError, refresh } = useProfessionalPackages();
  const [loadingPackage, setLoadingPackage] = useState<number | null>(null);
  const { data: session } = useSession();

  console.log(packages);
  
  const handleActivate = async (pkg: ProfessionalPackage) => {
    if (!session?.user?.id) {
      toast.error("Please login to continue");
      return;
    }

    setLoadingPackage(pkg.package_id);
    try {
      const response = await axios.post("/api/stripe/stripecheckout", {
        
          professionalId: session.user.id,
          packageId: pkg.package_id,
          amount: pkg.price,
          packageName: pkg.name,
          freeTrailDays: pkg.free_trail_days,
      });

      if (!response.status) {
        const errorData = await response.data.catch(() => ({}));
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const data = await response.data;

      if (!data.url) {
        throw new Error("No checkout URL received");
      }

      toast.success("Redirecting to Payment");
      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to redirect to payment"
      );
    } finally {
      setLoadingPackage(null);
    }
  };

  const buildFeatures = (pkg: ProfessionalPackage): string[] => {
    const features: string[] = [];

    if (pkg.free_enquiries) {
      features.push(`First ${pkg.free_enquiries} enquiries free each month`);
    }

    if (pkg.enquiry_price) {
      features.push(`Then from A$${pkg.enquiry_price} per enquiry`);
    }

    if (pkg.discount_percentage > 0) {
      features.push(`${pkg.discount_percentage}% off`);
    }

    if (pkg.has_performance_insights) {
      features.push("Performance insights to track how you're doing");
    }

    if (pkg.has_verified_badge) {
      features.push("Taskoria Verified to show clients you're trusted");
    }

    if (pkg.has_unlocked_inbox) {
      features.push("Unlocked Inbox so you can reply to your enquiries");
    }

    return features;
  };

  const PricingCard = ({
    pkg,
    highlighted = false,
  }: {
    pkg: ProfessionalPackage;
    highlighted?: boolean;
  }) => {
    const features = buildFeatures(pkg);

    return (
      <div className="relative group h-full">
        {highlighted && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
        )}
        
        <Card
          className={`relative h-full overflow-hidden transition-all duration-300 border-2 ${
            highlighted
              ? "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white border-blue-400 shadow-2xl shadow-blue-500/20 transform hover:scale-[1.03]"
              : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl hover:scale-[1.02]"
          } rounded-2xl`}
        >
          {/* {highlighted && (
            <div className="absolute top-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-white to-blue-400" />
          )} */}

          {pkg.badge && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full blur-md opacity-60" />
                <div className="relative bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5" />
                  {pkg.badge}
                </div>
              </div>
            </div>
          )}

          <CardContent className="p-5">
            <div className="mb-4 mt-1">
              <h3
                className={`text-xl font-bold mb-1.5 ${
                  highlighted ? "text-white" : "text-gray-900 dark:text-white"
                }`}
              >
                {pkg.name}
              </h3>
              <p
                className={`text-sm leading-relaxed min-h-[36px] ${
                  highlighted ? "text-blue-100" : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {pkg.description}
              </p>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-sm font-medium ${
                    highlighted ? "text-blue-200" : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  A$
                </span>
                <span className={`text-4xl font-bold tracking-tight ${
                  highlighted ? "text-white" : "text-gray-900 dark:text-white"
                }`}>
                  {typeof pkg.price === "number"
                    ? pkg.price.toFixed(0)
                    : pkg.price}
                </span>
                <span
                  className={`text-sm font-medium ml-1 ${
                    highlighted
                      ? "text-blue-200"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  /month
                </span>
              </div>
              <p
                className={`text-xs mt-1 ${
                  highlighted ? "text-blue-200" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                ex. GST • Billed monthly
              </p>
            </div>

            {/* Visibility Section */}
            <div className={`mb-4 pb-4 border-b ${
              highlighted ? "border-blue-500/30" : "border-gray-200 dark:border-gray-700"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-4 h-4 ${
                    highlighted ? "text-blue-200" : "text-blue-600 dark:text-blue-400"
                  }`} />
                  <span
                    className={`text-sm font-semibold ${
                      highlighted ? "text-white" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    Profile Visibility
                  </span>
                </div>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 transition-all ${
                        i < pkg.visibility_stars
                          ? highlighted
                            ? "fill-white text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                            : "fill-blue-600 text-blue-600 dark:fill-blue-500 dark:text-blue-500"
                          : highlighted
                            ? "text-blue-400/40 fill-blue-400/20"
                            : "text-gray-300 dark:text-gray-600 fill-gray-200 dark:fill-gray-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p
                className={`text-sm leading-relaxed ${
                  highlighted
                    ? "text-blue-100"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {pkg.visibility_description}
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-2.5 mb-5">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                      highlighted
                        ? "bg-white/20 backdrop-blur-sm"
                        : "bg-blue-50 dark:bg-blue-900/30"
                    }`}
                  >
                    <Check
                      className={`w-3.5 h-3.5 ${
                        highlighted
                          ? "text-white"
                          : "text-blue-600 dark:text-blue-400"
                      }`}
                      strokeWidth={3}
                    />
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      highlighted
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {feature}
                  </p>
                </div>
              ))}
            </div>

            <Button
              onClick={() => handleActivate(pkg)}
              disabled={loadingPackage !== null || isLoading}
              className={`w-full py-5 text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg ${
                highlighted
                  ? "bg-white text-blue-700 hover:bg-blue-50 hover:shadow-xl hover:shadow-white/20 disabled:bg-white/80"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/30 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500"
              } disabled:cursor-not-allowed`}
            >
              {loadingPackage === pkg.package_id ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Get {pkg.name.split(" ").slice(1).join(" ")}</span>
                  <Zap className="w-4 h-4" />
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-400/5 dark:bg-blue-600/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-6">
     <div className="">
          <Button
            variant="ghost"
            className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </Button>
        </div>

        <div className="text-center  max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Get More Clients
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-gray-900 via-blue-900 to-blue-800 dark:from-white dark:via-blue-200 dark:to-blue-300 bg-clip-text text-transparent leading-tight">
            This is where clients find you
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            With the right plan, your profile gets seen by more people looking to hire
          </p>

          <div className="flex items-center justify-center gap-6 mt-5">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Trusted by thousands</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Instant activation</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="relative inline-flex mb-6">
              <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full" />
              <div className="w-16 h-16 border-4 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin absolute top-0 left-0" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Loading pricing plans...
            </p>
          </div>
        ) : hasError ? (
          <div className="text-center py-16">
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <p className="text-red-600 dark:text-red-400 font-semibold mb-4 text-lg">
                Failed to load pricing plans
              </p>
              <Button
                onClick={() => refresh()}
                variant="outline"
                className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No packages available at the moment
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8 mt-6">
              {packages.map((pkg) => (
                <PricingCard
                  key={pkg.package_id}
                  pkg={pkg}
                  highlighted={pkg.badge === "Most popular"}
                />
              ))}
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    All plans include
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Everything you need to succeed on Taskoria
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800/50 rounded-xl">
                    <div className="flex-shrink-0 w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-0.5 text-sm">Taskoria Verified Badge</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Show clients you're a trusted professional</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800/50 rounded-xl">
                    <div className="flex-shrink-0 w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-0.5 text-sm">Unlocked Inbox</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Reply to enquiries and connect with clients</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Shield className="w-4 h-4" />
                <span>Secure payment powered by Stripe</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}