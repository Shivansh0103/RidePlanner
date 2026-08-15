import { useQuery } from "@tanstack/react-query";
import * as summaryApi from "../api/summaryApi";
import { summaryKeys } from "../api/summaryKeys";

export function useTripSummary(tripId: string) {
  return useQuery({
    queryKey: summaryKeys.tripSummary(tripId),
    queryFn: () => summaryApi.getTripSummary(tripId),
    enabled: Boolean(tripId),
  });
}
