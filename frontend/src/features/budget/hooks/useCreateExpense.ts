import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { summaryKeys } from "@/features/summary/api/summaryKeys";

import { createExpense } from "../api/budgetApi";
import { budgetKeys } from "../api/budgetKeys";
import type { ExpenseFormValues } from "../schemas/expenseSchemas";

export function useCreateExpense(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ExpenseFormValues) => createExpense(tripId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.expenses(tripId) });
      queryClient.invalidateQueries({ queryKey: summaryKeys.tripSummary(tripId) });
      toast.success("Expense logged successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to log expense.");
    },
  });
}
