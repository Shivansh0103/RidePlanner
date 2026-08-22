import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import * as memoryApi from "../api/memoryApi";
import { memoryKeys } from "../api/memoryKeys";

export function useDeleteTripMemory(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => memoryApi.deleteTripMemory(tripId, id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: memoryKeys.tripMemories(tripId),
      });
      toast.success("Ride memory deleted successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete memory.");
    },
  });
}
