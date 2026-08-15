import { useQuery } from "@tanstack/react-query";
import * as readinessApi from "../api/readinessApi";
import { readinessKeys } from "../api/readinessKeys";

export function useTripReadiness(tripId: string) {
  return useQuery({
    queryKey: readinessKeys.tripReadiness(tripId),
    queryFn: () => readinessApi.getTripReadiness(tripId),
    enabled: Boolean(tripId),
  });
}
