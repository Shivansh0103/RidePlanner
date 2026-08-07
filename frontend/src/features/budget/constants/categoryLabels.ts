import type { BudgetCategoryType } from "../types/budget";

export const CATEGORY_LABELS: Record<BudgetCategoryType, string> = {
  Fuel: "Fuel",
  Accommodation: "Accommodation",
  Food: "Food",
  TollsAndPermits: "Tolls & Permits",
  Miscellaneous: "Miscellaneous",
};

export const BUDGET_CATEGORIES: BudgetCategoryType[] = [
  "Fuel",
  "Accommodation",
  "Food",
  "TollsAndPermits",
  "Miscellaneous",
];
