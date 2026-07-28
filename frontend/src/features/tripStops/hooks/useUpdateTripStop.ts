import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
    }) =>
      updateTripStop(tripId, stopId, request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tripStops", tripId],
      });

      toast.success("Stop updated successfully.");
    },
  });
}