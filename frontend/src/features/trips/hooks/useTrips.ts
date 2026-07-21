import { useQuery } from "@tanstack/react-query";
import { tripKeys } from "../api/tripKeys";
import { getTrips } from "../api/tripApi";

export function useTrips() {
  return useQuery({
    queryKey: tripKeys.all,
    queryFn: getTrips,
  });
}