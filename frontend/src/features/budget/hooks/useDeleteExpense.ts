import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { summaryKeys } from "@/features/summary/api/summaryKeys";

import { deleteExpense } from "../api/budgetApi";
import { budgetKeys } from "../api/budgetKeys";

export function useDeleteExpense(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId: string) => deleteExpense(tripId, expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.expenses(tripId) });
      queryClient.invalidateQueries({ queryKey: summaryKeys.tripSummary(tripId) });
      toast.success("Expense deleted successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete expense.");
    },
  });
}
