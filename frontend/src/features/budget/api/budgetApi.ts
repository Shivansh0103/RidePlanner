import { apiClient } from "@/api/axios";

import type { CreateEstimateRequest } from "../schemas/createEstimateSchema";
import type { FuelCalculatorRequest } from "../schemas/fuelCalculatorSchema";
import type { UpdateBudgetRequest } from "../schemas/updateBudgetSchema";
import type { UpdateEstimateRequest } from "../schemas/updateEstimateSchema";
import type { TripBudget } from "../types/budget";

export async function getTripBudget(tripId: string): Promise<TripBudget> {
  const response = await apiClient.get<TripBudget>(`/trips/${tripId}/budget`);
  return response.data;
}

export async function updateTripBudget(
  tripId: string,
  request: UpdateBudgetRequest
): Promise<TripBudget> {
  const response = await apiClient.put<TripBudget>(
    `/trips/${tripId}/budget`,
    request
  );
  return response.data;
}

export async function createBudgetEstimate(
  tripId: string,
  request: CreateEstimateRequest
): Promise<TripBudget> {
  const response = await apiClient.post<TripBudget>(
    `/trips/${tripId}/budget/estimates`,
    request
  );
  return response.data;
}

export async function updateBudgetEstimate(
  tripId: string,
  estimateId: string,
  request: UpdateEstimateRequest
): Promise<TripBudget> {
  const response = await apiClient.put<TripBudget>(
    `/trips/${tripId}/budget/estimates/${estimateId}`,
    request
  );
  return response.data;
}

export async function deleteBudgetEstimate(
  tripId: string,
  estimateId: string
): Promise<TripBudget> {
  const response = await apiClient.delete<TripBudget>(
    `/trips/${tripId}/budget/estimates/${estimateId}`
  );
  return response.data;
}

export async function calculateFuelEstimate(
  tripId: string,
  request: FuelCalculatorRequest
): Promise<TripBudget> {
  const response = await apiClient.post<TripBudget>(
    `/trips/${tripId}/budget/fuel-estimate`,
    request
  );
  return response.data;
}
