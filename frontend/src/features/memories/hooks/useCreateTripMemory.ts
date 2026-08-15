import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as memoryApi from "../api/memoryApi";
import { memoryKeys } from "../api/memoryKeys";
import type { CreateMemoryRequest } from "../schemas/memorySchema";

export function useCreateTripMemory(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateMemoryRequest) =>
      memoryApi.createTripMemory(tripId, request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: memoryKeys.tripMemories(tripId),
      });
      toast.success("Ride memory added successfully.");
    },
    onError: () => {
      toast.error("Failed to add memory.");
    },
  });
}
