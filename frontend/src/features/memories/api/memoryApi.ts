import { apiClient } from "@/api/axios";
import type { CreateMemoryRequest, UpdateMemoryRequest } from "../schemas/memorySchema";
import type { TripMemory } from "../types/memory";

export async function getTripMemories(tripId: string): Promise<TripMemory[]> {
  const response = await apiClient.get<TripMemory[]>(`/trips/${tripId}/memories`);
  return response.data;
}

export async function createTripMemory(
  tripId: string,
  request: CreateMemoryRequest
): Promise<TripMemory> {
  const response = await apiClient.post<TripMemory>(`/trips/${tripId}/memories`, request);
  return response.data;
}

export async function updateTripMemory(
  tripId: string,
  id: string,
  request: UpdateMemoryRequest
): Promise<TripMemory> {
  const response = await apiClient.put<TripMemory>(`/trips/${tripId}/memories/${id}`, request);
  return response.data;
}

export async function deleteTripMemory(tripId: string, id: string): Promise<void> {
  await apiClient.delete(`/trips/${tripId}/memories/${id}`);
}
