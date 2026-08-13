import { apiClient } from "@/api/axios";

import type { CreateTripRequest } from "../schemas/createTripSchema";
import type { UpdateTripRequest } from "../schemas/updateTripSchema";
import type { Trip } from "../types/trip";

export async function createTrip(
  trip: CreateTripRequest
): Promise<Trip> {
  const response = await apiClient.post<Trip>(
    "/trips",
    trip
  );

  return response.data;
}

export async function getTrips(): Promise<Trip[]> {
  const response = await apiClient.get<Trip[]>("/trips");

  return response.data;
}

export async function getTrip(id: string): Promise<Trip> {
  const response = await apiClient.get<Trip>(`/trips/${id}`);

  return response.data;
}

export async function updateTrip(
  request: UpdateTripRequest
): Promise<Trip> {

  const { id, ...trip } = request;

  const response = await apiClient.put<Trip>(
    `/trips/${id}`,
    trip
  );

  return response.data;
}

export async function deleteTrip(id: string): Promise<void> {
  await apiClient.delete(`/trips/${id}`);
}

export async function startTrip(
  id: string,
  actualStart?: string
): Promise<Trip> {
  const response = await apiClient.post<Trip>(`/trips/${id}/start`, {
    actualStart,
  });

  return response.data;
}

export async function completeTrip(
  id: string,
  actualCompletion?: string
): Promise<Trip> {
  const response = await apiClient.post<Trip>(`/trips/${id}/complete`, {
    actualCompletion,
  });

  return response.data;
}