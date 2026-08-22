import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import * as memoryApi from "../api/memoryApi";
import { memoryKeys } from "../api/memoryKeys";
import type { UpdateMemoryRequest } from "../schemas/memorySchema";

interface UpdateTripMemoryParams {
  id: string;
  request: UpdateMemoryRequest;
}

export function useUpdateTripMemory(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: UpdateTripMemoryParams) =>
      memoryApi.updateTripMemory(tripId, id, request),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: memoryKeys.tripMemories(tripId),
      });
      queryClient.invalidateQueries({
        queryKey: memoryKeys.detail(tripId, variables.id),
      });
      toast.success("Ride memory updated successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update memory.");
    },
  });
}
