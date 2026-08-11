import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { budgetKeys } from "@/features/budget/api/budgetKeys";
import { tripStopKeys } from "@/features/tripStops/api/tripStopKeys";

import { accommodationKeys } from "../api/accommodationKeys";
import { accommodationsApi } from "../api/accommodationsApi";
import type { CreateAccommodationRequest } from "../types/accommodation";

export function useCreateAccommodation(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAccommodationRequest) =>
      accommodationsApi.createAccommodation(tripId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accommodationKeys.all(tripId) });
      queryClient.invalidateQueries({ queryKey: tripStopKeys.all(tripId) });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(tripId) });
      toast.success("Accommodation stay added successfully!");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to create accommodation stay.");
    },
  });
}
