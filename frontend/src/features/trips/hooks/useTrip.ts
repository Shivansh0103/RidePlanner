import { useQuery } from "@tanstack/react-query";

import { getTrip } from "../api/tripApi";
import { tripKeys } from "../api/tripKeys";

export function useTrip(id: string) {
  return useQuery({
    queryKey: tripKeys.detail(id),
    queryFn: () => getTrip(id),
    enabled: !!id,
  });
}