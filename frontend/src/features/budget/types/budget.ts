export type BudgetCategoryType =
  | "Fuel"
  | "Accommodation"
  | "Food"
  | "TollsAndPermits"
  | "Miscellaneous";

export interface BudgetEstimate {
  id: string;
  title: string;
  estimatedAmount: number;
}

export interface BudgetCategory {
  category: BudgetCategoryType;
  estimatedAmount: number;
  estimates: BudgetEstimate[];
}

export interface TripBudget {
  targetBudget: number;
  estimatedCost: number;
  remainingBuffer: number;
  categories: BudgetCategory[];
}
