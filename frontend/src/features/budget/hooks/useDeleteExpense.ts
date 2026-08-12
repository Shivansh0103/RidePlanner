import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteExpense } from "../api/budgetApi";
import { budgetKeys } from "../api/budgetKeys";

export function useDeleteExpense(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId: string) => deleteExpense(tripId, expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.expenses(tripId) });
      toast.success("Expense deleted successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.Error || "Failed to delete expense.";
      toast.error(message);
    },
  });
}
