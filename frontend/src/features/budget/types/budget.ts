export type BudgetCategoryType =
  | "Fuel"
  | "Accommodation"
  | "Food"
  | "TollsAndPermits"
  | "Miscellaneous";

export type PaymentMethod =
  | "Cash"
  | "UPI"
  | "CreditCard"
  | "DebitCard"
  | "Other";

export interface BudgetEstimate {
  id: string;
  title: string;
  estimatedAmount: number;
  accommodationId?: string | null;
}

export interface Expense {
  id: string;
  tripBudgetId: string;
  category: BudgetCategoryType;
  title: string;
  amount: number;
  expenseDate: string;
  paymentMethod?: PaymentMethod | null;
  notes?: string | null;
  accommodationId?: string | null;
  tripStopId?: string | null;
  createdAt: string;
}

export interface BudgetCategory {
  category: BudgetCategoryType;
  estimatedAmount: number;
  actualAmount: number;
  variance: number;
  estimates: BudgetEstimate[];
  expenses: Expense[];
}

export interface TripBudget {
  targetBudget: number;
  estimatedCost: number;
  actualCost: number;
  remainingBuffer: number;
  remainingTargetBuffer: number;
  variance: number;
  categories: BudgetCategory[];
}
