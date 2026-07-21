import { apiClient } from "@/api/axios";
import type { Trip } from "../types/trip";
import type { TripFormValues } from "../schemas/tripSchema";

export async function createTrip(
  trip: TripFormValues
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