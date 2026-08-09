import { useQuery } from "@tanstack/react-query";

import { accommodationKeys } from "../api/accommodationKeys";
import { accommodationsApi } from "../api/accommodationsApi";

export function useAccommodations(tripId: string) {
  return useQuery({
    queryKey: accommodationKeys.all(tripId),
    queryFn: () => accommodationsApi.getAccommodations(tripId),
    enabled: !!tripId,
  });
}
