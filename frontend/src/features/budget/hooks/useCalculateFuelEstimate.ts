import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { calculateFuelEstimate } from "../api/budgetApi";
import { budgetKeys } from "../api/budgetKeys";
import type { FuelCalculatorRequest } from "../schemas/fuelCalculatorSchema";

export function useCalculateFuelEstimate(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: FuelCalculatorRequest) =>
      calculateFuelEstimate(tripId, request),
    onSuccess: (data) => {
      queryClient.setQueryData(budgetKeys.detail(tripId), data);
      toast.success("Fuel cost calculated and estimate updated.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.Error || "Failed to calculate fuel cost.";
      toast.error(message);
    },
  });
}
