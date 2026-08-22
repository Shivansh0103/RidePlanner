import { describe, expect, it } from "vitest";

import { createTripSchema } from "../createTripSchema";

describe("createTripSchema validation", () => {
  it("validates a valid trip payload", () => {
    const validData = {
      name: "Ladakh Himalayan Odyssey",
      description: "Epic high-altitude motorcycle expedition",
      startDate: "2026-09-01",
      endDate: "2026-09-14",
    };

    const result = createTripSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when name is shorter than 3 characters", () => {
    const invalidData = {
      name: "Go",
      description: "",
      startDate: "2026-09-01",
      endDate: "2026-09-14",
    };

    const result = createTripSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Trip name must be at least 3 characters.");
    }
  });

  it("fails when end date is before start date", () => {
    const invalidData = {
      name: "Coast Ride",
      description: "",
      startDate: "2026-09-15",
      endDate: "2026-09-10",
    };

    const result = createTripSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("End date must be on or after the start date.");
    }
  });
});
