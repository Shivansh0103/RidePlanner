import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { summaryKeys } from "@/features/summary/api/summaryKeys";

import { deleteBudgetEstimate } from "../api/budgetApi";
import { budgetKeys } from "../api/budgetKeys";

export function useDeleteBudgetEstimate(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (estimateId: string) =>
      deleteBudgetEstimate(tripId, estimateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: summaryKeys.tripSummary(tripId) });
      toast.success("Estimate deleted successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete estimate.");
    },
  });
}
