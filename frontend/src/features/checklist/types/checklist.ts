export interface ChecklistItem {
  id: string;
  categoryId: string;
  title: string;
  isCompleted: boolean;
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
  completionPercentage: number;
  categories: ChecklistCategory[];
}
