import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { summaryKeys } from "@/features/summary/api/summaryKeys";

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
      queryClient.invalidateQueries({
        queryKey: summaryKeys.tripSummary(tripId),
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to reorder stops.");
      queryClient.invalidateQueries({
        queryKey: tripStopKeys.all(tripId),
      });
    },
  });
}
