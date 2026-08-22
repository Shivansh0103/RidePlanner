import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { summaryKeys } from "@/features/summary/api/summaryKeys";

import { updateBudgetEstimate } from "../api/budgetApi";
import { budgetKeys } from "../api/budgetKeys";
import type { UpdateEstimateRequest } from "../schemas/updateEstimateSchema";

interface UpdateBudgetEstimateParams {
  estimateId: string;
  request: UpdateEstimateRequest;
}

export function useUpdateBudgetEstimate(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ estimateId, request }: UpdateBudgetEstimateParams) =>
      updateBudgetEstimate(tripId, estimateId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: summaryKeys.tripSummary(tripId) });
      toast.success("Estimate updated successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update estimate.");
    },
  });
}
