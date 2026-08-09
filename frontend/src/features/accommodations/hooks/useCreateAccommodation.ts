import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      queryClient.invalidateQueries({ queryKey: ["trips", tripId, "stops"] });
      queryClient.invalidateQueries({ queryKey: ["trips", tripId, "budget"] });
      toast.success("Accommodation stay added successfully!");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to create accommodation stay.");
    },
  });
}
