import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { accommodationKeys } from "@/features/accommodations/api/accommodationKeys";
import { readinessKeys } from "@/features/readiness/api/readinessKeys";
import { summaryKeys } from "@/features/summary/api/summaryKeys";

import { tripStopKeys } from "../api/tripStopKeys";
import { deleteTripStop } from "../api/tripStopsApi";

export function useDeleteTripStop(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stopId: string) => deleteTripStop(tripId, stopId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tripStopKeys.all(tripId),
      });
      queryClient.invalidateQueries({
        queryKey: accommodationKeys.all(tripId),
      });
      queryClient.invalidateQueries({
        queryKey: readinessKeys.tripReadiness(tripId),
      });
      queryClient.invalidateQueries({
        queryKey: summaryKeys.tripSummary(tripId),
      });

      toast.success("Stop deleted successfully.");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete stop.");
    },
  });
}
