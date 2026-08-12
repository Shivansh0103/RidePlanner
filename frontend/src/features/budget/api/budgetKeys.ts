export const budgetKeys = {
  all: ["budgets"] as const,
  detail: (tripId: string) => ["budgets", tripId] as const,
  expenses: (tripId: string) => ["budgets", tripId, "expenses"] as const,
};
