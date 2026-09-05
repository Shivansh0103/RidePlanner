export type SupportedCurrency = "INR" | "USD" | "EUR" | "GBP";
export type SupportedDistanceUnit = "Kilometers" | "Miles";

export interface UserProfile {
  preferredCurrencyCode: SupportedCurrency;
  distanceUnit: SupportedDistanceUnit;
  defaultVehicleName: string | null;
  defaultTankCapacityLitres: number | null;
  defaultFuelEfficiencyKmPerLitre: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  preferredCurrencyCode: string;
  distanceUnit: string;
  defaultVehicleName?: string | null;
  defaultTankCapacityLitres?: number | null;
  defaultFuelEfficiencyKmPerLitre?: number | null;
}
