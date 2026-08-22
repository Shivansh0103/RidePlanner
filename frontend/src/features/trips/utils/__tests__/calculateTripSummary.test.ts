import { describe, expect, it } from "vitest";

import { TripStopCategory } from "@/features/tripStops/types/tripStopCategory";

import { calculateTripDays, calculateTripSummaryMetrics } from "../calculateTripSummary";

describe("calculateTripSummary utilities", () => {
  describe("calculateTripDays", () => {
    it("returns 0 if either start or end date is missing", () => {
      expect(calculateTripDays(undefined, "2026-08-25")).toBe(0);
      expect(calculateTripDays("2026-08-20", undefined)).toBe(0);
    });

    it("calculates inclusive days accurately for a date range", () => {
      // Aug 20 to Aug 25 is 6 inclusive days
      expect(calculateTripDays("2026-08-20", "2026-08-25")).toBe(6);
      // Single day trip
      expect(calculateTripDays("2026-08-20", "2026-08-20")).toBe(1);
    });
  });

  describe("calculateTripSummaryMetrics", () => {
    it("aggregates stop categories correctly", () => {
      const mockStops = [
        { id: "1", tripId: "t1", name: "Hotel 1", placeId: null, category: TripStopCategory.Hotel, arrivalDate: "2026-08-20", departureDate: "2026-08-21", displayOrder: 1, formattedAddress: "Address", latitude: 12, longitude: 77, notes: null },
        { id: "2", tripId: "t1", name: "Fuel 1", placeId: null, category: TripStopCategory.Fuel, arrivalDate: "2026-08-21", departureDate: "2026-08-21", displayOrder: 2, formattedAddress: "Address", latitude: 12, longitude: 77, notes: null },
        { id: "3", tripId: "t1", name: "Food 1", placeId: null, category: TripStopCategory.Food, arrivalDate: "2026-08-21", departureDate: "2026-08-21", displayOrder: 3, formattedAddress: "Address", latitude: 12, longitude: 77, notes: null },
        { id: "4", tripId: "t1", name: "Attraction 1", placeId: null, category: TripStopCategory.Attraction, arrivalDate: "2026-08-22", departureDate: "2026-08-22", displayOrder: 4, formattedAddress: "Address", latitude: 12, longitude: 77, notes: null },
      ];

      const metrics = calculateTripSummaryMetrics("2026-08-20", "2026-08-22", mockStops);

      expect(metrics.totalStops).toBe(4);
      expect(metrics.totalDays).toBe(3);
      expect(metrics.hotels).toBe(1);
      expect(metrics.fuelStops).toBe(1);
      expect(metrics.foodStops).toBe(1);
    });
  });
});
