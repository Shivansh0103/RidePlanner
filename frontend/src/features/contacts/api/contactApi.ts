import { apiClient } from "@/api/axios";
import type { CreateContactRequest, UpdateContactRequest } from "../schemas/contactSchema";
import type { EmergencyContact } from "../types/contact";

export async function getEmergencyContacts(tripId: string): Promise<EmergencyContact[]> {
  const response = await apiClient.get<EmergencyContact[]>(`/trips/${tripId}/contacts`);
  return response.data;
}

export async function createEmergencyContact(
  tripId: string,
  request: CreateContactRequest
): Promise<EmergencyContact> {
  const response = await apiClient.post<EmergencyContact>(`/trips/${tripId}/contacts`, request);
  return response.data;
}

export async function updateEmergencyContact(
  tripId: string,
  id: string,
  request: UpdateContactRequest
): Promise<EmergencyContact> {
  const response = await apiClient.put<EmergencyContact>(`/trips/${tripId}/contacts/${id}`, request);
  return response.data;
}

export async function deleteEmergencyContact(tripId: string, id: string): Promise<void> {
  await apiClient.delete(`/trips/${tripId}/contacts/${id}`);
}
