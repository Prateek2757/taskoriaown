"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Package } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCredit } from "@/hooks/useCredit";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    id: "credits",
    question: "What are credits?",
    answer:
      "Credits are used to contact leads and unlock their full profiles. Each contact costs a certain number of credits based on the lead quality.",
  },
  {
    id: "starter",
    question: "What is the starter pack?",
    answer:
      "The starter pack gives you 100 credits (enough for about 10 leads) at a discounted rate with our Get Hired Guarantee.",
  },
  {
    id: "guarantee",
    question: "What is the Get Hired Guarantee?",
    answer:
      "We’re so confident you’ll get hired at least once that if you don’t, we’ll return all the credits. Terms and conditions apply.",
  },
];

interface CreditPurchaseProps {
  mode?: "page" | "modal";
  requiredCredits?: number;
  contactName?: string;
  taskId?: string | number;
  professionalId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onPurchaseSuccess?: () => void;
}

export function CreditPurchase({
  mode = "page",
  requiredCredits,
  contactName,
  professionalId,
  taskId,
  open = true,
  onOpenChange,
  onPurchaseSuccess,
}: CreditPurchaseProps) {
  const {
    packages,
    fetchPackages,
    purchaseCredits,
    balance,
    fetchBalance,
    loading,
  } = useCredit(professionalId);

  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
const [loadingButton , setLoadingButton]=useState(false)
  useEffect(() => {
    if ((mode === "modal" && open) || mode === "page") {
      fetchPackages();
      fetchBalance();
    }
  }, [mode, open, fetchPackages, fetchBalance]);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const selected = packages.find((p) => p.package_id === selectedPackage);

  const handleDeductCredits = async () => {
    if (!selected) {
      toast.error("Please select the package first");
      return;
    }
    setLoadingButton(true)
    try {
      const res = await fetch("/api/stripe/stripecheckout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalId,
          packageId: selected?.package_id,
          amount: selected?.price,
          credits: selected.credits,
          packageName: selected?.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      toast.error("Error Deducting Credit");
    }
    // const res = await fetch("/api/stripecheckout", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     amount: selected?.price,         // $20
    //     productName: "Premium Plan",
    //   }),
    // });

    // const data = await res.json();
    // window.location.href = data.url; // Redir
    // try {
    //   const res = await fetch("/api/admin/deduct-credit", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       professionalId,
    //        taskId:Number(taskId),
    //       credits: requiredCredits,
    //     }),
    //   });

    //   if (!res.ok) throw new Error("Failed to deduct credits");

    //   toast.success(
    //     `Successfully deducted ${requiredCredits} credits to contact ${contactName}`
    //   );
    //   fetchBalance();
    //   onPurchaseSuccess?.();
    //   if (onOpenChange) onOpenChange(false);
    // } catch (err) {
    //   console.error(err);
    //   toast.error("Error deducting credits");
    // }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) {
      toast.error("Please select a package first");
      return;
    }

    const result = await purchaseCredits(selectedPackage);
    if (result) {
      toast.success("Credit purchase successful!");
      onPurchaseSuccess?.();
      if (mode === "modal" && onOpenChange) onOpenChange(false);
    }
  };

  const showPackages =
    mode === "page" || (requiredCredits && balance < requiredCredits);

  const content = (
    <div className="w-full">
      {mode === "modal" && requiredCredits && (
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            You need {requiredCredits} credits to contact {contactName}
          </h2>
          <p className="text-gray-600 text-sm">
            Purchase credits or deduct if you have enough.
          </p>
        </div>
      )}

      <div className="text-center mb-6">
        <p className="text-gray-700 text-sm">
          Current Balance:{" "}
          <span className="font-semibold text-blue-600">{balance ?? 0}</span>{" "}
          credits
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {FAQS.map((faq) => (
          <div
            key={faq.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFaq(faq.id)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between text-left"
            >
              <span className="font-semibold text-gray-900 text-sm md:text-base">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  expandedFaq === faq.id ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedFaq === faq.id && (
              <div className="px-4 py-3 bg-white text-gray-600 text-sm">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show Packages only if balance is low */}
      {showPackages && (
        <>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading credit packages...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No credit packages available.
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.package_id}
                  onClick={() => setSelectedPackage(pkg.package_id)}
                  className={`border-2 rounded-xl p-4 md:p-6 cursor-pointer transition ${
                    selectedPackage === pkg.package_id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {pkg.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {pkg.credits} credits • ~{pkg.leads_estimate} leads
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                      A${pkg.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Action button */}
      {requiredCredits && balance >= requiredCredits ? (
        <Button
          onClick={handlePurchase}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-base"
          size="lg"
        >
          Contact Lead – Deduct {requiredCredits} Credits
        </Button>
      ) : (
        selected && (
          <Button
            onClick={handleDeductCredits}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-base"
            size="lg"
          >
            {loadingButton
              ? "Processing..."
              : `Buy ${selected.credits} credits for A$${selected.price}`}
          </Button>
        )
      )}
    </div>
  );

  // Render modal or page mode
  if (mode === "modal") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Credit Purchase</DialogTitle>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4"
        >
          <span>←</span>
          <span>Settings</span>
        </button>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          My Credits
        </h1>
      </div>
      {content}
    </div>
  );
}

export function CreditPurchaseModal(props: Omit<CreditPurchaseProps, "mode">) {
  return <CreditPurchase {...props} mode="modal" />;
}

export function CreditPurchasePage(props: Omit<CreditPurchaseProps, "mode">) {
  return <CreditPurchase {...props} mode="page" />;
}
