export const summaryKeys = {
  all: ["summary"] as const,
  tripSummary: (tripId: string) => [...summaryKeys.all, "trip", tripId] as const,
};
