import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import * as tripApi from "../api/tripApi";
import { tripKeys } from "../api/tripKeys";
import type { UpdateTripRequest } from "../schemas/updateTripSchema";

export function useUpdateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateTripRequest) => tripApi.updateTrip(request),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: tripKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: tripKeys.detail(data.id),
      });

      toast.success("Trip updated successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update trip.");
    },
  });
}