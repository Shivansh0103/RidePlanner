import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { accommodationKeys } from "../api/accommodationKeys";
import { accommodationsApi } from "../api/accommodationsApi";
import type { UpdateAccommodationRequest } from "../types/accommodation";

export function useUpdateAccommodation(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAccommodationRequest;
    }) => accommodationsApi.updateAccommodation(tripId, id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accommodationKeys.all(tripId) });
      queryClient.invalidateQueries({ queryKey: ["trips", tripId, "stops"] });
      queryClient.invalidateQueries({ queryKey: ["trips", tripId, "budget"] });
      toast.success("Accommodation stay updated successfully!");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update accommodation stay.");
    },
  });
}
