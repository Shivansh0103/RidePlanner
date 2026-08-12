import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateExpense } from "../api/budgetApi";
import { budgetKeys } from "../api/budgetKeys";
import type { ExpenseFormValues } from "../schemas/expenseSchemas";

interface UpdateExpenseParams {
  expenseId: string;
  request: ExpenseFormValues;
}

export function useUpdateExpense(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expenseId, request }: UpdateExpenseParams) =>
      updateExpense(tripId, expenseId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.expenses(tripId) });
      toast.success("Expense updated successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.Error || "Failed to update expense.";
      toast.error(message);
    },
  });
}
