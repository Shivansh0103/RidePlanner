import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { tripStopKeys } from "../api/tripStopKeys";
import { reorderTripStops } from "../api/tripStopsApi";

export function useReorderTripStops(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedStopIds: string[]) => reorderTripStops(tripId, orderedStopIds),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tripStopKeys.all(tripId),
      });
    },

    onError: () => {
      toast.error("Failed to reorder stops.");
      queryClient.invalidateQueries({
        queryKey: tripStopKeys.all(tripId),
      });
    },
  });
}
