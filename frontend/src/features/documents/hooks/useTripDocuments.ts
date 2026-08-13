import { useQuery } from "@tanstack/react-query";
import * as documentApi from "../api/documentApi";
import { documentKeys } from "../api/documentKeys";

export function useTripDocuments(tripId: string) {
  return useQuery({
    queryKey: documentKeys.tripDocuments(tripId),
    queryFn: () => documentApi.getTripDocuments(tripId),
    enabled: Boolean(tripId),
  });
}
