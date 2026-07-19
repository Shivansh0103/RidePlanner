import { useQuery } from "@tanstack/react-query";

import { getTrips } from "../api/tripApi";

export function useTrips() {
  return useQuery({
    queryKey: ["trips"],
    queryFn: getTrips,
  });
}