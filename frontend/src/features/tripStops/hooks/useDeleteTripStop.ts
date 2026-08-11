import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { accommodationKeys } from "@/features/accommodations/api/accommodationKeys";

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

      toast.success("Stop deleted successfully.");
    },
  });
}
