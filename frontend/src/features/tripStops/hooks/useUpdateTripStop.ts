import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { accommodationKeys } from "@/features/accommodations/api/accommodationKeys";
import { readinessKeys } from "@/features/readiness/api/readinessKeys";
import { summaryKeys } from "@/features/summary/api/summaryKeys";

import { tripStopKeys } from "../api/tripStopKeys";
import { updateTripStop } from "../api/tripStopsApi";
import type { CreateTripStop } from "../types/createTripStop";

export function useUpdateTripStop(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stopId,
      request,
    }: {
      stopId: string;
      request: CreateTripStop;
    }) => updateTripStop(tripId, stopId, request),

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

      toast.success("Stop updated successfully.");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update stop.");
    },
  });
}