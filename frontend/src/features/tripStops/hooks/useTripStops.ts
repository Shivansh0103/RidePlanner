import { useQuery } from "@tanstack/react-query";

import { tripStopKeys } from "../api/tripStopKeys";
import { getTripStops } from "../api/tripStopsApi";

export function useTripStops(tripId: string) {
  return useQuery({
    queryKey: tripStopKeys.all(tripId),
    queryFn: () => getTripStops(tripId),
    enabled: !!tripId,
  });
}