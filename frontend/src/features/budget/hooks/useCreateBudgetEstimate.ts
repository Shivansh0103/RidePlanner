import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createBudgetEstimate } from "../api/budgetApi";
import { budgetKeys } from "../api/budgetKeys";
import type { CreateEstimateRequest } from "../schemas/createEstimateSchema";

export function useCreateBudgetEstimate(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateEstimateRequest) =>
      createBudgetEstimate(tripId, request),
    onSuccess: (data) => {
      queryClient.setQueryData(budgetKeys.detail(tripId), data);
      toast.success("Estimate added successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.Error || "Failed to add budget estimate.";
      toast.error(message);
    },
  });
}
