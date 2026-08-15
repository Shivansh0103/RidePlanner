import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as memoryApi from "../api/memoryApi";
import { memoryKeys } from "../api/memoryKeys";
import type { UpdateMemoryRequest } from "../schemas/memorySchema";

export function useUpdateTripMemory(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateMemoryRequest }) =>
      memoryApi.updateTripMemory(tripId, id, request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: memoryKeys.tripMemories(tripId),
      });
      toast.success("Ride memory updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update memory.");
    },
  });
}
