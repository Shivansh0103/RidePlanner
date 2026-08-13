export type TripStatus = "Planning" | "Active" | "Completed";

export interface Trip {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  status: TripStatus;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}