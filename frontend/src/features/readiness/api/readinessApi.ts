import { apiClient } from "@/api/axios";
import type { TripReadiness } from "../types/readiness";

export async function getTripReadiness(tripId: string): Promise<TripReadiness> {
  const response = await apiClient.get<TripReadiness>(`/trips/${tripId}/readiness`);
  return response.data;
}
