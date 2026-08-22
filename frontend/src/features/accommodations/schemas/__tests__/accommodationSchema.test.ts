import { describe, expect, it } from "vitest";

import { accommodationSchema } from "../accommodationSchema";

describe("accommodationSchema validation", () => {
  it("validates a complete accommodation payload", () => {
    const validData = {
      name: "Grand Mountain Resort",
      type: "Resort" as const,
      checkInDate: "2026-09-02",
      checkOutDate: "2026-09-04",
      formattedAddress: "Leh, Ladakh, India",
      cost: 4500,
    };

    const result = accommodationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when cost is negative", () => {
    const invalidData = {
      name: "Highway Motel",
      type: "Hotel" as const,
      checkInDate: "2026-09-02",
      checkOutDate: "2026-09-03",
      formattedAddress: "Highway 1",
      cost: -100,
    };

    const result = accommodationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails when check-out date is before check-in date", () => {
    const invalidData = {
      name: "Highway Motel",
      type: "Hotel" as const,
      checkInDate: "2026-09-05",
      checkOutDate: "2026-09-02",
      formattedAddress: "Highway 1",
      cost: 1500,
    };

    const result = accommodationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
