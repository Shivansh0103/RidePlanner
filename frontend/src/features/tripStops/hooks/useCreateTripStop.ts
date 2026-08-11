import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { accommodationKeys } from "@/features/accommodations/api/accommodationKeys";

import { tripStopKeys } from "../api/tripStopKeys";
import { createTripStop } from "../api/tripStopsApi";
import type { CreateTripStop } from "../types/createTripStop";

export function useCreateTripStop(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateTripStop) => createTripStop(tripId, request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tripStopKeys.all(tripId),
      });
      queryClient.invalidateQueries({
        queryKey: accommodationKeys.all(tripId),
      });

      toast.success("Stop added successfully.");
    },
  });
}