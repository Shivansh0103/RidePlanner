import { useQuery } from "@tanstack/react-query";

import { getTripStops } from "../api/tripStopsApi";

export function useTripStops(tripId: string) {
  return useQuery({
    queryKey: ["tripStops", tripId],
    queryFn: () => getTripStops(tripId),
    enabled: !!tripId,
  });
}