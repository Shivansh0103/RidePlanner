import { apiClient } from "@/api/axios";
import type { Trip } from "../types/trip";

export async function getTrips(): Promise<Trip[]> {
  const response = await apiClient.get<Trip[]>("/trips");

  return response.data;
}