export const readinessKeys = {
  all: ["readiness"] as const,
  tripReadiness: (tripId: string) => [...readinessKeys.all, "trip", tripId] as const,
};
