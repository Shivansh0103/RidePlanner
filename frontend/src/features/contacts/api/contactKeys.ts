export const contactKeys = {
  all: ["emergencyContacts"] as const,
  tripContacts: (tripId: string) => [...contactKeys.all, "trip", tripId] as const,
  detail: (tripId: string, id: string) => [...contactKeys.tripContacts(tripId), id] as const,
};
