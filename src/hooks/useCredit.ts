"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

export interface CreditPackage {
  package_id: number;
  package_name: string;
  credits: number;
  price: number;
  original_price?: number;
  price_per_credit: number;
  leads_estimate: number;
  has_guarantee: boolean;
  description?: string;
}

interface CreditState {
  balance: number;
  packages: CreditPackage[];
  loading: boolean;
}

export function useCredit(professionalId?: string) {
  const [state, setState] = useState<CreditState>({
    balance: 0,
    packages: [],
    loading: false,
  });

  const fetchBalance = useCallback(async () => {
    if (!professionalId) return;
    setState((s) => ({ ...s, loading: true }));

    try {
      const { data } = await axios.get(`/api/admin/credit-balance`);

      setState((s) => ({ ...s, balance: data.balance || 0 }));
      return data.balance;
    } catch (error: any) {
      console.error("Balance fetch error:", error);
      toast.error(error.response?.data?.error || "Failed to fetch credit balance");
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  }, [professionalId]);

  const fetchPackages = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));

    try {
      const { data } = await axios.get(`/api/admin/credit-packages`);
      setState((s) => ({ ...s, packages: data || [] }));
      return data;
    } catch (error: any) {
      console.error("Credit packages error:", error);
      toast.error(error.response?.data?.error || "Unable to load credit packages");
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  const estimateCredits = useCallback(async (taskId: number, action = "lead_response") => {
    try {
      const { data } = await axios.get(`/api/credits/estimate`, {
        params: { task_id: taskId, action },
      });
      return data.estimated || 0;
    } catch (error: any) {
      console.error("Credit estimate error:", error);
      toast.error(error.response?.data?.error || "Unable to estimate credits");
      return 0;
    }
  }, []);

  /** ✅ Deduct credits safely (e.g. when responding to a lead) */
  const deductCredits = useCallback(
    async (taskId: number, creditsUsed: number) => {
      if (!professionalId) {
        toast.error("Professional ID missing");
        return false;
      }

      try {
        const { data } = await axios.post(`/api/credits/deduct`, {
          professional_id: professionalId,
          task_id: taskId,
          credits_used: creditsUsed,
        });

        toast.success(data.message || "Credits deducted successfully");
        await fetchBalance();
        return true;
      } catch (error: any) {
        console.error("Credit deduction error:", error);
        toast.error(error.response?.data?.error || "Credit deduction failed");
        return false;
      }
    },
    [professionalId, fetchBalance]
  );

  const purchaseCredits = useCallback(
    async (packageId: number) => {
      if (!professionalId) {
        toast.error("Professional ID required");
        return;
      }

      setState((s) => ({ ...s, loading: true }));

      try {
        const transactionRef = `TXN-${Date.now()}`;
        const { data } = await axios.post(`/api/admin/credit-topups`, {
          professional_id: professionalId,
          package_id: packageId,
          payment_method: "Card",
          transaction_ref: transactionRef,
        });

        toast.success("Credit purchase successful!");
        await fetchBalance();
        return data;
      } catch (error: any) {
        console.error("Credit purchase error:", error);
        toast.error(error.response?.data?.error || "Purchase failed");
      } finally {
        setState((s) => ({ ...s, loading: false }));
      }
    },
    [professionalId, fetchBalance]
  );

  useEffect(() => {
    if (professionalId) fetchBalance();
  }, [professionalId, fetchBalance]);

  return {
    balance: state.balance,
    packages: state.packages,
    loading: state.loading,
    fetchBalance,
    fetchPackages,
    estimateCredits,
    deductCredits,
    purchaseCredits,
  };
}