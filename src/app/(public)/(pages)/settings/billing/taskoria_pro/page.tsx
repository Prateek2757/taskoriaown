"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  useProfessionalPackages,
  type ProfessionalPackage,
} from "@/hooks/useProfessionalPackage";

export default function TaskoriaProPage() {
  const router = useRouter();
  const { packages, isLoading, hasError, refresh } = useProfessionalPackages();
  const [loadingPackage, setLoadingPackage] = useState<number | null>(null);
  const { data: session } = useSession();

  const handleActivate = async (pkg: ProfessionalPackage) => {
    if (!session?.user?.id) {
      toast.error("Please login to continue");
      return;
    }

    setLoadingPackage(pkg.package_id);
    try {
      const response = await fetch("/api/stripe/stripecheckout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          professionalId: session.user.id,
          packageId: pkg.package_id,
          amount: pkg.price,
          packageName: pkg.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const data = await response.json();

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
      features.push(`Then from $${pkg.enquiry_price} per enquiry`);
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
      <Card
        className={`relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
          highlighted
            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-500 shadow-xl"
            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
        }`}
      >
        {pkg.badge && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
            {pkg.badge}
          </div>
        )}

        <CardContent className="p-6">
          <h3
            className={`text-xl font-bold mb-1.5 ${
              highlighted ? "text-white" : "text-gray-900 dark:text-white"
            }`}
          >
            {pkg.name}
          </h3>
          <p
            className={`text-xs mb-4 min-h-[32px] ${
              highlighted ? "text-blue-100" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {pkg.description}
          </p>

          <div className="mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">
                A$
                {typeof pkg.price === "number"
                  ? pkg.price.toFixed(0)
                  : pkg.price}
              </span>
              <span
                className={`text-xs ${
                  highlighted
                    ? "text-blue-100"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                /month (ex. GST)
              </span>
            </div>
          </div>

          <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1 mb-1.5">
              <span
                className={`text-sm font-semibold ${
                  highlighted ? "text-white" : "text-gray-900 dark:text-white"
                }`}
              >
                Visibility
              </span>
              <div className="flex gap-0.5 ml-1">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < pkg.visibility_stars
                        ? highlighted
                          ? "fill-white text-white"
                          : "fill-blue-600 text-blue-600"
                        : highlighted
                          ? "text-blue-300"
                          : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p
              className={`text-xs ${
                highlighted
                  ? "text-blue-100"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {pkg.visibility_description}
            </p>
          </div>

          <div className="space-y-2 mb-5">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div
                  className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${
                    highlighted ? "bg-white" : "bg-gray-400 dark:bg-gray-600"
                  }`}
                />
                <p
                  className={`text-xs leading-relaxed ${
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
            className={`w-full py-3 text-sm font-semibold rounded-lg transition-all ${
              highlighted
                ? "bg-white text-blue-600 hover:bg-gray-100 disabled:bg-gray-200"
                : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400"
            }`}
          >
            {loadingPackage === pkg.package_id
              ? "Processing..."
              : `Get ${pkg.name.split(" ").slice(1).join(" ")}`}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 py-6 px-4">
      <div className="max-w-6xl mx-auto">
      
        <div className="text-center mb-7">
        <Button
          variant="ghost"
          className="pt-10 flex items-center gap-2 hover: text-sm"
          onClick={() => router.back()}
        >
          ← Back
        </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            This is where clients find you
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            With the right plan, your profile gets seen by more people looking
            to hire
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Loading plans...
            </p>
          </div>
        ) : hasError ? (
          <div className="text-center py-10">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 dark:text-red-400 font-medium mb-3">
                Failed to load pricing plans
              </p>
              <Button
                onClick={() => refresh()}
                variant="outline"
                className="text-sm"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400">
              No packages available at the moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <PricingCard
                key={pkg.package_id}
                pkg={pkg}
                highlighted={pkg.badge === "Most popular"}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            All plans include Taskoria Verified badge and unlocked inbox
          </p>
        </div>
      </div>
    </div>
  );
}
