import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteBudgetEstimate } from "../api/budgetApi";
import { budgetKeys } from "../api/budgetKeys";

export function useDeleteBudgetEstimate(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (estimateId: string) =>
      deleteBudgetEstimate(tripId, estimateId),
    onSuccess: (data) => {
      queryClient.setQueryData(budgetKeys.detail(tripId), data);
      toast.success("Estimate deleted successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.Error || "Failed to delete budget estimate.";
      toast.error(message);
    },
  });
}
