import { apiClient } from "@/api/axios";

import type { TripStop } from "../types/tripStop";

export async function getTripStops(tripId: string): Promise<TripStop[]> {
  const response = await apiClient.get<TripStop[]>(`/trips/${tripId}/stops`);

  return response.data;
}