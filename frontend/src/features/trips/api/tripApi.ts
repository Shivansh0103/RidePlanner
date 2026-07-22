import { apiClient } from "@/api/axios";
import type { Trip } from "../types/trip";
import type { CreateTripRequest } from "../schemas/createTripSchema";
import type { UpdateTripRequest } from "../schemas/updateTripSchema";

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