import { apiClient } from "@/api/axios";

import type { TripStop } from "../types/tripStop";
import type { CreateTripStop } from "../types/createTripStop";

export async function getTripStops(tripId: string): Promise<TripStop[]> {
  const response = await apiClient.get<TripStop[]>(`/trips/${tripId}/stops`);

  return response.data;
}

export async function createTripStop(
  tripId: string,
  request: CreateTripStop
) {
  const response = await apiClient.post(
    `/trips/${tripId}/stops`,
    request
  );

  return response.data;
}