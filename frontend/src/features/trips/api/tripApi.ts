import { apiClient } from "@/api/axios";
import type { Trip } from "../types/trip";
import type { CreateTripRequest } from "../schemas/createTripSchema";

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