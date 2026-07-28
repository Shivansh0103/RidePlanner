import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

      toast.success("Stop updated successfully.");
    },
  });
}