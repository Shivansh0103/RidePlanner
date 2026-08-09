import { apiClient } from "@/api/axios";

import type {
  Accommodation,
  CreateAccommodationRequest,
  UpdateAccommodationRequest,
} from "../types/accommodation";

function cleanString(val?: string | null): string | null {
  if (!val) return null;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function sanitizePayload<T extends CreateAccommodationRequest | UpdateAccommodationRequest>(
  payload: T
): T {
  return {
    ...payload,
    checkInTime: cleanString(payload.checkInTime),
    checkOutTime: cleanString(payload.checkOutTime),
    placeId: cleanString(payload.placeId),
    confirmationNumber: cleanString(payload.confirmationNumber),
    contactName: cleanString(payload.contactName),
    contactPhone: cleanString(payload.contactPhone),
    website: cleanString(payload.website),
    bookingNotes: cleanString(payload.bookingNotes),
  };
}

export const accommodationsApi = {
  getAccommodations: async (tripId: string): Promise<Accommodation[]> => {
    const response = await apiClient.get<Accommodation[]>(
      `/trips/${tripId}/accommodations`
    );
    return response.data;
  },

  getAccommodationById: async (
    tripId: string,
    id: string
  ): Promise<Accommodation> => {
    const response = await apiClient.get<Accommodation>(
      `/trips/${tripId}/accommodations/${id}`
    );
    return response.data;
  },

  createAccommodation: async (
    tripId: string,
    payload: CreateAccommodationRequest
  ): Promise<Accommodation> => {
    const cleanData = sanitizePayload(payload);
    const response = await apiClient.post<Accommodation>(
      `/trips/${tripId}/accommodations`,
      cleanData
    );
    return response.data;
  },

  updateAccommodation: async (
    tripId: string,
    id: string,
    payload: UpdateAccommodationRequest
  ): Promise<Accommodation> => {
    const cleanData = sanitizePayload(payload);
    const response = await apiClient.put<Accommodation>(
      `/trips/${tripId}/accommodations/${id}`,
      cleanData
    );
    return response.data;
  },

  deleteAccommodation: async (tripId: string, id: string): Promise<void> => {
    await apiClient.delete(`/trips/${tripId}/accommodations/${id}`);
  },
};
