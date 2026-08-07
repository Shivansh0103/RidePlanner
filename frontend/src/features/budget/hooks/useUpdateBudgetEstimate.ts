import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateBudgetEstimate } from "../api/budgetApi";
import { budgetKeys } from "../api/budgetKeys";
import type { UpdateEstimateRequest } from "../schemas/updateEstimateSchema";

export function useUpdateBudgetEstimate(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      estimateId,
      request,
    }: {
      estimateId: string;
      request: UpdateEstimateRequest;
    }) => updateBudgetEstimate(tripId, estimateId, request),
    onSuccess: (data) => {
      queryClient.setQueryData(budgetKeys.detail(tripId), data);
      toast.success("Estimate updated successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.Error || "Failed to update budget estimate.";
      toast.error(message);
    },
  });
}
