export const memoryKeys = {
  all: ["memories"] as const,
  tripMemories: (tripId: string) => [...memoryKeys.all, "trip", tripId] as const,
  detail: (tripId: string, id: string) => [...memoryKeys.tripMemories(tripId), id] as const,
};
