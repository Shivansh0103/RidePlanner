import { useQuery } from "@tanstack/react-query";

import { getTrips } from "../api/tripApi";
import { tripKeys } from "../api/tripKeys";

export function useTrips() {
  return useQuery({
    queryKey: tripKeys.all,
    queryFn: getTrips,
  });
}