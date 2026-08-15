import { apiClient } from "@/api/axios";
import type { TripSummary } from "../types/summary";

export async function getTripSummary(tripId: string): Promise<TripSummary> {
  const response = await apiClient.get<TripSummary>(`/trips/${tripId}/summary`);
  return response.data;
}
