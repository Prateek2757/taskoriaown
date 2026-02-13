"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, Sparkles, Shield, Zap, Check, ArrowLeft, CreditCard, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCredit } from "@/hooks/useCredit";
import axios from "axios";

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
      "We're so confident you'll get hired at least once that if you don't, we'll return all the credits. Terms and conditions apply.",
  },
];

interface CreditPurchaseProps {
  mode?: "page" | "modal";
  requiredCredits?: number;
  contactName?: string;
  userId?: string | number;
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
  userId,
  open = true,
  onOpenChange,
  onPurchaseSuccess,
}: CreditPurchaseProps) {
  const {
    packages,
    fetchPackages,
    deductCredits,
    fetchBalance,
    balance,
    loading,
  } = useCredit(professionalId);

  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [loadingButton, setLoadingButton] = useState(false);
  const [leadStatus, setLeadStatus] = useState({ count: 0, purchased: false });
  const [loadingResponses, setLoadingResponses] = useState(false);

  const toggleFaq = (id: string) =>
    setExpandedFaq(expandedFaq === id ? null : id);

  useEffect(() => {
    if ((mode === "modal" && open) || mode === "page") {
      fetchPackages();
      fetchBalance();
    }
  }, [mode, open, fetchPackages, fetchBalance]);

  const fetchResponses = useCallback(async () => {
    if (!taskId) return;
    setLoadingResponses(true);
    try {
      const { data } = await axios.get(`/api/admin/task-responses/${taskId}`);
      setLeadStatus(data);
    } catch (err) {
      console.error("Error fetching responses:", err);
      toast.error("Failed to fetch lead status");
    } finally {
      setLoadingResponses(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  const selected = packages.find((p) => p.package_id === selectedPackage);

  const handleDeduct = async () => {
    if (!requiredCredits || !taskId) return;

    setLoadingButton(true);
    try {
      const result = await deductCredits(Number(taskId), Number(requiredCredits));
      if (!result) throw new Error("Failed to deduct");

      await fetchBalance();
      toast.success(`Deducted ${requiredCredits} credits`);
      onPurchaseSuccess?.();
      if (mode === "modal" && onOpenChange) onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Error deducting credits");
    } finally {
      setLoadingButton(false);
    }
  };

  const handlePurchase = async () => {
    if (!selected) {
      toast.error("Please select a package first");
      return;
    }

    setLoadingButton(true);
    try {
      const { data } = await axios.post("/api/stripe/stripecheckout", {
        professionalId,
        packageId: selected.package_id,
        amount: selected.price,
        freeTrailDays: "1",
        credits: selected.credits,
        packageName: selected.name,
      });
      toast.success("Redirecting to payment...");
      window.location.href = data.url;
    } catch (error: any) {
      const message =
        error?.response?.data.error ||
        error?.response?.data.message ||
        "something went wrong";
      console.error(error);
      toast.error(message);
    } finally {
      setLoadingButton(false);
    }
  };

  const showPackages =
    mode === "page" || (requiredCredits && balance < requiredCredits);

  const content = (
    <div className="w-full">
      {mode === "modal" && requiredCredits && (
        <div className="relative mb-4 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-blue-950/20 dark:to-blue-950/20 rounded-2xl -z-10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl -z-10" />
          
          <div className="relative py-4 px-4">
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 mb-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Premium Lead Access
              </span>
            </div> */}
            
            <h2 className="text-2xl  font-bold mb-3 bg-gradient-to-r from-gray-900 via-blue-900 to-blue-900 dark:from-white dark:via-blue-200 dark:to-blue-200 bg-clip-text text-transparent">
              Unlock {contactName}'s Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base max-w-md mx-auto">
              You need <span className="font-bold text-blue-600 dark:text-blue-400">{requiredCredits} credits</span> to contact this lead
            </p>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
          <div className="relative bg-gradient-to-br from-blue-600 to-blue-600 dark:from-blue-600 dark:to-blue-400 rounded-2xl p-4 ">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-blue-100 text-sm font-medium">Available Balance</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {balance ?? 0} <span className="text-lg font-normal text-blue-100">credits</span>
                  </p>
                </div>
              </div>
              <Sparkles className="w-8 h-8 text-white/40" />
            </div>
          </div>
        </div>
      </div>

    

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span className="text-2xl">💡</span> Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <div
              key={faq.id}
              className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-600 transition-all"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-5 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors flex items-center justify-between text-left group"
              >
                <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all ${
                    expandedFaq === faq.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedFaq === faq.id && (
                <div className="px-5 py-4 bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 text-sm border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showPackages && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Choose Your Package
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Select a credit package that fits your needs
          </p>

          {loading ? (
            <div className="text-center py-12">
              <div className="relative inline-flex">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-600 dark:border-t-blue-400 absolute top-0 left-0"></div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-4 font-medium">Loading credit packages...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No credit packages available.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {packages.map((pkg, index) => {
                const isPopular = index === 1; 
                const isBestValue = index === packages.length - 1; 
                
                return (
                  <div
                    key={pkg.package_id}
                    onClick={() => setSelectedPackage(pkg.package_id)}
                    className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                      selectedPackage === pkg.package_id
                        ? "border-blue-600 dark:border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 shadow-xl shadow-blue-200/50 dark:shadow-blue-900/30"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800 hover:shadow-lg"
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <div className="px-4 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                          ⭐ MOST POPULAR
                        </div>
                      </div>
                    )}
                    
                    {isBestValue && (
                      <div className="absolute -top-3 right-4">
                        <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                          💎 BEST VALUE
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {pkg.name}
                          </h3>
                          {selectedPackage === pkg.package_id && (
                            <div className="p-1.5 bg-blue-600 dark:bg-blue-500 rounded-full">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-gray-700 dark:text-gray-300 font-semibold">
                              {pkg.credits} credits
                            </span>
                          </div>
                          {/* <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                              ~{pkg.leads_estimate} leads
                            </span>
                          </div> */}
                        </div>

                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                          <span className="text-xs font-medium text-green-700 dark:text-green-400">
                            A${(pkg.price / pkg.credits).toFixed(2)} per credit
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-blue-600 to-blue-600 dark:from-blue-400 dark:to-blue-400 bg-clip-text text-transparent">
                          A${pkg.price}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          one-time payment
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        {requiredCredits && balance >= requiredCredits ? (
          <Button
            onClick={handleDeduct}
            disabled={loadingButton}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-600 dark:hover:to-emerald-600 font-semibold py-7 text-base shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 rounded-xl group"
            size="lg"
          >
            {loadingButton ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Deducting Credits...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Contact Lead – Deduct {requiredCredits} Credits</span>
              </div>
            )}
          </Button>
        ) : (
          selected && (
            <Button
              onClick={handlePurchase}
              disabled={loadingButton}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-600 text-white dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-600 font-semibold py-7 text-base shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 rounded-xl group"
              size="lg"
            >
              {loadingButton ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Buy {selected.credits} credits for A${selected.price}</span>
                </div>
              )}
            </Button>
          )
        )}
          <div className="grid grid-cols-3 gap-3 m-3">
        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <Shield className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
          <span className="text-xs text-gray-600 dark:text-gray-400 text-center font-medium">Secure Payment</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mb-2" />
          <span className="text-xs text-gray-600 dark:text-gray-400 text-center font-medium">Instant Access</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <Check className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
          <span className="text-xs text-gray-600 dark:text-gray-400 text-center font-medium">Guaranteed</span>
        </div>
      </div>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2">
          <Shield className="w-4 h-4" />
          <span>Secured by Stripe • SSL Encrypted</span>
        </div>
      </div>
    </div>
  );

  if (mode === "modal") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <DialogTitle className="sr-only">Credit Purchase</DialogTitle>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Settings</span>
          </button>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-blue-500 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                My Credits
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your credits and unlock premium leads
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
          {content}
        </div>

        {/* <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>Money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span>Instant delivery</span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export function CreditPurchaseModal(props: Omit<CreditPurchaseProps, "mode">) {
  return <CreditPurchase {...props} mode="modal" />;
}

export function CreditPurchasePage(props: Omit<CreditPurchaseProps, "mode">) {
  return <CreditPurchase {...props} mode="page" />;
}