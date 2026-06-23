"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  createCreditTopup,
  deductProfessionalCredits,
  estimateTaskCredits,
  getCreditBalance,
  listCreditPackages,
  listTaskCreditEstimates,
} from "@/services/credits";

export interface CreditPackage {
  package_id: number;
  name: string;
  credits: number;
  price: number;
  stripe_price_id: string;
  original_price?: number;
  price_per_credit: number;
  leads_estimate: number;
  has_guarantee: boolean;
  description?: string;
}

interface CreditState {
  balance: number;
  packages: CreditPackage[];
  taskCredits: Record<number, number>;
  loading: boolean;
}

export function useCredit(professionalId?: string) {
  const [state, setState] = useState<CreditState>({
    balance: 0,
    packages: [],
    taskCredits: {},
    loading: false,
  });

  const fetchBalance = useCallback(async () => {
    if (!professionalId) return;
    setState((s) => ({ ...s, loading: true }));

    try {
      const data = await getCreditBalance();
      setState((s) => ({ ...s, balance: data.balance || 0 }));
      return data.balance;
    } catch (error) {
      console.error("Balance fetch error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to fetch credit balance");
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  }, [professionalId]);

  const fetchPackages = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));

    try {
      const data = await listCreditPackages();
      setState((s) => ({ ...s, packages: data || [] }));
      return data;
    } catch (error) {
      console.error("Credit packages error:", error);
      toast.error(error instanceof Error ? error.message : "Unable to load credit packages");
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  const estimateCredits = useCallback(
    async (taskId: number, action = "lead_response") => {
      try {
        const data = await estimateTaskCredits(taskId, action);
        return data.estimated || 0;
      } catch (error) {
        console.error("Credit estimate error:", error);
        toast.error(error instanceof Error ? error.message : "Unable to estimate credits");
        return 0;
      }
    },
    []
  );

  const fetchCreditEstimates = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));

    try {
      const data = await listTaskCreditEstimates();

      if (data?.tasks && Array.isArray(data.tasks)) {
        const creditsMap: Record<number, number> = {};
        data.tasks.forEach(
          (t: { task_id: number; estimated_credits: number }) => {
            creditsMap[t.task_id] = t.estimated_credits;
          }
        );
        setState((s) => ({ ...s, taskCredits: creditsMap }));
        return creditsMap;
      } else {
        throw new Error("Invalid credit estimate data");
      }
    } catch (error) {
      console.error("Credit estimate fetch error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to fetch credit estimates");
      return {};
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  const deductCredits = useCallback(
    async (taskId: number, creditsUsed: number) => {
      if (!professionalId) {
        toast.error("Professional ID missing");
        return false;
      }

      try {
        const data = await deductProfessionalCredits({
          professionalId,
          taskId,
          credits: creditsUsed,
        });
        const { success, responseId, balance } = data;
        // toast.success(`Credits deducted successfully ${creditsUsed}`);
        await fetchBalance();
        return { success, responseId, balance };
      } catch (error) {
        console.error("Credit deduction error:", error);
        toast.error(error instanceof Error ? error.message : "Credit deduction failed");
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
        const data = await createCreditTopup({
          professionalId,
          packageId,
        });

        await fetchBalance();
        return data;
      } catch (error) {
        console.error("Credit purchase error:", error);
        toast.error(error instanceof Error ? error.message : "Purchase failed");
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
    taskCredits: state.taskCredits,
    loading: state.loading,
    fetchBalance,
    fetchPackages,
    estimateCredits,
    fetchCreditEstimates,
    deductCredits,
    purchaseCredits,
  };
}
