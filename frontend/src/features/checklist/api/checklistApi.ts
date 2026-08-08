import { apiClient } from "@/api/axios";

import type { CreateCategoryRequest, UpdateCategoryRequest } from "../schemas/categorySchema";
import type { CreateItemRequest, UpdateItemRequest } from "../schemas/itemSchema";
import type { ChecklistSummary } from "../types/checklist";

export async function getTripChecklist(tripId: string): Promise<ChecklistSummary> {
  const response = await apiClient.get<ChecklistSummary>(`/trips/${tripId}/checklist`);
  return response.data;
}

export async function createChecklistCategory(
  tripId: string,
  request: CreateCategoryRequest
): Promise<ChecklistSummary> {
  const response = await apiClient.post<ChecklistSummary>(
    `/trips/${tripId}/checklist/categories`,
    request
  );
  return response.data;
}

export async function updateChecklistCategory(
  tripId: string,
  categoryId: string,
  request: UpdateCategoryRequest
): Promise<ChecklistSummary> {
  const response = await apiClient.put<ChecklistSummary>(
    `/trips/${tripId}/checklist/categories/${categoryId}`,
    request
  );
  return response.data;
}

export async function deleteChecklistCategory(
  tripId: string,
  categoryId: string
): Promise<ChecklistSummary> {
  const response = await apiClient.delete<ChecklistSummary>(
    `/trips/${tripId}/checklist/categories/${categoryId}`
  );
  return response.data;
}

export async function createChecklistItem(
  tripId: string,
  request: CreateItemRequest
): Promise<ChecklistSummary> {
  const response = await apiClient.post<ChecklistSummary>(
    `/trips/${tripId}/checklist/items`,
    request
  );
  return response.data;
}

export async function updateChecklistItem(
  tripId: string,
  itemId: string,
  request: UpdateItemRequest
): Promise<ChecklistSummary> {
  const response = await apiClient.put<ChecklistSummary>(
    `/trips/${tripId}/checklist/items/${itemId}`,
    request
  );
  return response.data;
}

export async function toggleChecklistItem(
  tripId: string,
  itemId: string,
  isCompleted?: boolean
): Promise<ChecklistSummary> {
  const response = await apiClient.patch<ChecklistSummary>(
    `/trips/${tripId}/checklist/items/${itemId}/toggle`,
    { isCompleted }
  );
  return response.data;
}

export async function deleteChecklistItem(
  tripId: string,
  itemId: string
): Promise<ChecklistSummary> {
  const response = await apiClient.delete<ChecklistSummary>(
    `/trips/${tripId}/checklist/items/${itemId}`
  );
  return response.data;
}
