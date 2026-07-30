import { TRIP_STOP_CATEGORY_METADATA } from "./tripStopCategoryMetadata";
import type { TripStopCategory } from "../types/tripStopCategory";

export type TripStopCategoryOption = {
  value: TripStopCategory;
  label: string;
};

export const TRIP_STOP_CATEGORY_OPTIONS: readonly TripStopCategoryOption[] = Object.values(
  TRIP_STOP_CATEGORY_METADATA
).map((meta) => ({
  value: meta.value,
  label: meta.label,
}));
