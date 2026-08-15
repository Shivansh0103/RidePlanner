import { useQuery } from "@tanstack/react-query";
import * as memoryApi from "../api/memoryApi";
import { memoryKeys } from "../api/memoryKeys";

export function useTripMemories(tripId: string) {
  return useQuery({
    queryKey: memoryKeys.tripMemories(tripId),
    queryFn: () => memoryApi.getTripMemories(tripId),
    enabled: Boolean(tripId),
  });
}
