import type { TripStatus } from "@/features/trips/types/trip";

export interface TripSummary {
  tripId: string;
  tripName: string;
  status: TripStatus;
  startedAt?: string | null;
  completedAt?: string | null;
  totalDurationDays: number;
  totalStops: number;
  totalDistanceKm: number;

  targetBudget: number;
  totalExpenses: number;
  budgetVariance: number;
  totalAccommodations: number;
  totalNights: number;
  totalAccommodationCost: number;
  totalChecklistItems: number;
  completedChecklistItems: number;
  checklistCompletionPercentage: number;
}
