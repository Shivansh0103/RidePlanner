import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteTripStop } from "../api/tripStopsApi";

export function useDeleteTripStop(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stopId: string) => deleteTripStop(tripId, stopId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tripStops", tripId],
      });

      toast.success("Stop deleted successfully.");
    },
  });
}
