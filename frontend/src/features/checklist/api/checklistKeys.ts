export const checklistKeys = {
  all: ["checklists"] as const,
  detail: (tripId: string) => [...checklistKeys.all, tripId] as const,
};
