import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

      toast.success("Stop deleted successfully.");
    },
  });
}

