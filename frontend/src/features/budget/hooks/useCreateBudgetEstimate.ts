import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { summaryKeys } from "@/features/summary/api/summaryKeys";

import { createBudgetEstimate } from "../api/budgetApi";
import { budgetKeys } from "../api/budgetKeys";
import type { CreateEstimateRequest } from "../schemas/createEstimateSchema";

export function useCreateBudgetEstimate(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateEstimateRequest) =>
      createBudgetEstimate(tripId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: summaryKeys.tripSummary(tripId) });
      toast.success("Estimate added successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add estimate.");
    },
  });
}
