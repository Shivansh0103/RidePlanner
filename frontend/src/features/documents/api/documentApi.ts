import { apiClient } from "@/api/axios";
import type { CreateDocumentRequest, UpdateDocumentRequest } from "../schemas/documentSchema";
import type { TripDocument } from "../types/document";

function sanitizeDocumentPayload<T extends CreateDocumentRequest | UpdateDocumentRequest>(request: T) {
  return {
    ...request,
    expiryDate: request.expiryDate && request.expiryDate.trim() !== ""
      ? new Date(request.expiryDate).toISOString()
      : null,
    documentNumber: request.documentNumber && request.documentNumber.trim() !== ""
      ? request.documentNumber.trim()
      : null,
    filePath: request.filePath && request.filePath.trim() !== ""
      ? request.filePath.trim()
      : null,
    notes: request.notes && request.notes.trim() !== ""
      ? request.notes.trim()
      : null,
  };
}

export async function getTripDocuments(tripId: string): Promise<TripDocument[]> {
  const response = await apiClient.get<TripDocument[]>(`/trips/${tripId}/documents`);
  return response.data;
}

export async function createTripDocument(
  tripId: string,
  request: CreateDocumentRequest
): Promise<TripDocument> {
  const payload = sanitizeDocumentPayload(request);
  const response = await apiClient.post<TripDocument>(`/trips/${tripId}/documents`, payload);
  return response.data;
}

export async function updateTripDocument(
  tripId: string,
  id: string,
  request: UpdateDocumentRequest
): Promise<TripDocument> {
  const payload = sanitizeDocumentPayload(request);
  const response = await apiClient.put<TripDocument>(`/trips/${tripId}/documents/${id}`, payload);
  return response.data;
}

export async function deleteTripDocument(tripId: string, id: string): Promise<void> {
  await apiClient.delete(`/trips/${tripId}/documents/${id}`);
}
