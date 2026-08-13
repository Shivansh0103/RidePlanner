import { apiClient } from "@/api/axios";
import type { CreateDocumentRequest, UpdateDocumentRequest } from "../schemas/documentSchema";
import type { TripDocument } from "../types/document";

export async function getTripDocuments(tripId: string): Promise<TripDocument[]> {
  const response = await apiClient.get<TripDocument[]>(`/trips/${tripId}/documents`);
  return response.data;
}

export async function createTripDocument(
  tripId: string,
  request: CreateDocumentRequest
): Promise<TripDocument> {
  const response = await apiClient.post<TripDocument>(`/trips/${tripId}/documents`, request);
  return response.data;
}

export async function updateTripDocument(
  tripId: string,
  id: string,
  request: UpdateDocumentRequest
): Promise<TripDocument> {
  const response = await apiClient.put<TripDocument>(`/trips/${tripId}/documents/${id}`, request);
  return response.data;
}

export async function deleteTripDocument(tripId: string, id: string): Promise<void> {
  await apiClient.delete(`/trips/${tripId}/documents/${id}`);
}
