export const documentKeys = {
  all: ["documents"] as const,
  tripDocuments: (tripId: string) => [...documentKeys.all, "trip", tripId] as const,
  detail: (tripId: string, id: string) => [...documentKeys.tripDocuments(tripId), id] as const,
};
