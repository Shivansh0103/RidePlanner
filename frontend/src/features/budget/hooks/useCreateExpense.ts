import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      toast.success("Expense logged successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.Error || "Failed to log expense.";
      toast.error(message);
    },
  });
}
