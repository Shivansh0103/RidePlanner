import { apiClient } from "@/api/axios";

import type { CreateTripStop } from "../types/createTripStop";
import type { TripStop } from "../types/tripStop";

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

export async function updateTripStop(
  tripId: string,
  stopId: string,
  request: CreateTripStop
) {
  const response = await apiClient.put(
    `/trips/${tripId}/stops/${stopId}`,
    request
  );

  return response.data;
}

export async function deleteTripStop(tripId: string, stopId: string) {
  const response = await apiClient.delete(
    `/trips/${tripId}/stops/${stopId}`
  );

  return response.data;
}