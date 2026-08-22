import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { summaryKeys } from "@/features/summary/api/summaryKeys";

import { calculateFuelEstimate } from "../api/budgetApi";
import { budgetKeys } from "../api/budgetKeys";
import type { FuelCalculatorRequest } from "../schemas/fuelCalculatorSchema";

export function useCalculateFuelEstimate(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: FuelCalculatorRequest) =>
      calculateFuelEstimate(tripId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(tripId) });
      queryClient.invalidateQueries({ queryKey: summaryKeys.tripSummary(tripId) });
      toast.success("Fuel cost calculated and estimate updated.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to calculate fuel estimate.");
    },
  });
}
