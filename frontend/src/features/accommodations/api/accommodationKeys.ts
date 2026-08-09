export const accommodationKeys = {
  all: (tripId: string) => ["trips", tripId, "accommodations"] as const,
  detail: (tripId: string, id: string) =>
    ["trips", tripId, "accommodations", id] as const,
};
