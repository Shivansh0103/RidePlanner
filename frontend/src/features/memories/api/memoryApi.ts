import { apiClient } from "@/api/axios";
import type { CreateMemoryRequest, UpdateMemoryRequest } from "../schemas/memorySchema";
import type { TripMemory } from "../types/memory";

function sanitizeMemoryPayload<T extends CreateMemoryRequest | UpdateMemoryRequest>(request: T) {
  return {
    ...request,
    memoryDate: request.memoryDate && request.memoryDate.trim() !== ""
      ? new Date(request.memoryDate).toISOString()
      : null,
    content: request.content && request.content.trim() !== ""
      ? request.content.trim()
      : null,
    imageUrl: request.imageUrl && request.imageUrl.trim() !== ""
      ? request.imageUrl.trim()
      : null,
  };
}

export async function getTripMemories(tripId: string): Promise<TripMemory[]> {
  const response = await apiClient.get<TripMemory[]>(`/trips/${tripId}/memories`);
  return response.data;
}

export async function createTripMemory(
  tripId: string,
  request: CreateMemoryRequest
): Promise<TripMemory> {
  const payload = sanitizeMemoryPayload(request);
  const response = await apiClient.post<TripMemory>(`/trips/${tripId}/memories`, payload);
  return response.data;
}

export async function updateTripMemory(
  tripId: string,
  id: string,
  request: UpdateMemoryRequest
): Promise<TripMemory> {
  const payload = sanitizeMemoryPayload(request);
  const response = await apiClient.put<TripMemory>(`/trips/${tripId}/memories/${id}`, payload);
  return response.data;
}

export async function deleteTripMemory(tripId: string, id: string): Promise<void> {
  await apiClient.delete(`/trips/${tripId}/memories/${id}`);
}
