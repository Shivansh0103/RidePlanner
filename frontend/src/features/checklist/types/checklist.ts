export interface ChecklistItem {
  id: string;
  categoryId: string;
  title: string;
  isCompleted: boolean;
  isRequired: boolean;
  displayOrder: number;
}

export interface ChecklistCategory {
  id: string;
  tripId: string;
  name: string;
  displayOrder: number;
  completedItemsCount: number;
  totalItemsCount: number;
  items: ChecklistItem[];
}

export interface ChecklistSummary {
  tripId: string;
  totalItemsCount: number;
  completedItemsCount: number;
  requiredItemsCount: number;
  completedRequiredItemsCount: number;
  completionPercentage: number;
  categories: ChecklistCategory[];
}

