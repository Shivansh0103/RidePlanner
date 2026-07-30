import { TripStopCategory } from "@/features/tripStops/types/tripStopCategory";
import type { TripStop } from "@/features/tripStops/types/tripStop";

export type TripSummaryMetrics = {
  totalStops: number;
  totalDays: number;
  hotels: number;
  fuelStops: number;
  foodStops: number;
};

export function calculateTripDays(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 0;
}

export function calculateTripSummaryMetrics(
  startDate?: string,
  endDate?: string,
  stops: TripStop[] = []
): TripSummaryMetrics {
  const totalStops = stops.length;
  const totalDays = calculateTripDays(startDate, endDate);

  let hotels = 0;
  let fuelStops = 0;
  let foodStops = 0;

  for (const stop of stops) {
    if (stop.category === TripStopCategory.Hotel) {
      hotels++;
    } else if (stop.category === TripStopCategory.Fuel) {
      fuelStops++;
    } else if (stop.category === TripStopCategory.Food) {
      foodStops++;
    }
  }

  return {
    totalStops,
    totalDays,
    hotels,
    fuelStops,
    foodStops,
  };
}
