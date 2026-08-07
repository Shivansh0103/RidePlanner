import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateTripBudget } from "../api/budgetApi";
import { budgetKeys } from "../api/budgetKeys";
import type { UpdateBudgetRequest } from "../schemas/updateBudgetSchema";

export function useUpdateTripBudget(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateBudgetRequest) =>
      updateTripBudget(tripId, request),
    onSuccess: (data) => {
      queryClient.setQueryData(budgetKeys.detail(tripId), data);
      toast.success("Target budget updated successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.Error || "Failed to update target budget.";
      toast.error(message);
    },
  });
}
