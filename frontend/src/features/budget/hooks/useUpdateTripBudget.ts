import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { summaryKeys } from "@/features/summary/api/summaryKeys";

import { updateTripBudget } from "../api/budgetApi";
import { budgetKeys } from "../api/budgetKeys";
import type { UpdateBudgetRequest } from "../schemas/updateBudgetSchema";

export function useUpdateTripBudget(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateBudgetRequest) =>
      updateTripBudget(tripId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: summaryKeys.tripSummary(tripId) });
      toast.success("Target budget updated successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update target budget.");
    },
  });
}
