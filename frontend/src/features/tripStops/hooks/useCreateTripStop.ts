import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createTripStop } from "../api/tripStopsApi";
import type { CreateTripStop } from "../types/createTripStop";

export function useCreateTripStop(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateTripStop) =>
      createTripStop(tripId, request),

    onSuccess: () => {
    queryClient.invalidateQueries({
        queryKey: ["tripStops", tripId],
    });

    toast.success("Stop added successfully.");
}
  });
}