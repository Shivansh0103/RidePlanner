import { useQuery } from "@tanstack/react-query";
import * as contactApi from "../api/contactApi";
import { contactKeys } from "../api/contactKeys";

export function useEmergencyContacts(tripId: string) {
  return useQuery({
    queryKey: contactKeys.tripContacts(tripId),
    queryFn: () => contactApi.getEmergencyContacts(tripId),
    enabled: Boolean(tripId),
  });
}
