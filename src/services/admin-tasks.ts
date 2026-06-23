import { api } from "@/lib/api-client";

type UpdateTaskBudgetResponse = {
  success?: boolean;
  message?: string;
};

export function updateTaskBudget(taskId: number, estimatedBudget: number) {
  return api.patch<UpdateTaskBudgetResponse>(
    `/api/admin/individual-task-budgetupdate/${taskId}`,
    { estimated_budget: estimatedBudget }
  );
}
