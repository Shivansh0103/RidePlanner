import { describe, expect, it } from "vitest";

import { profileSchema } from "../profileSchema";

describe("profileSchema", () => {
  it("validates a complete valid profile data payload", () => {
    const input = {
      preferredCurrencyCode: "USD",
      distanceUnit: "Miles",
      defaultVehicleName: "Honda Transalp",
      defaultTankCapacityLitres: 16.9,
      defaultFuelEfficiencyKmPerLitre: 24.5,
    };

    const parsed = profileSchema.safeParse(input);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.preferredCurrencyCode).toBe("USD");
      expect(parsed.data.distanceUnit).toBe("Miles");
      expect(parsed.data.defaultVehicleName).toBe("Honda Transalp");
      expect(parsed.data.defaultTankCapacityLitres).toBe(16.9);
      expect(parsed.data.defaultFuelEfficiencyKmPerLitre).toBe(24.5);
    }
  });

  it("validates minimal payload with optional fields as null or empty", () => {
    const input = {
      preferredCurrencyCode: "INR",
      distanceUnit: "Kilometers",
      defaultVehicleName: null,
      defaultTankCapacityLitres: null,
      defaultFuelEfficiencyKmPerLitre: null,
    };

    const parsed = profileSchema.safeParse(input);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.preferredCurrencyCode).toBe("INR");
      expect(parsed.data.distanceUnit).toBe("Kilometers");
      expect(parsed.data.defaultVehicleName).toBeNull();
      expect(parsed.data.defaultTankCapacityLitres).toBeNull();
      expect(parsed.data.defaultFuelEfficiencyKmPerLitre).toBeNull();
    }
  });

  it("rejects unsupported currency code", () => {
    const input = {
      preferredCurrencyCode: "JPY",
      distanceUnit: "Kilometers",
    };

    const parsed = profileSchema.safeParse(input);
    expect(parsed.success).toBe(false);
  });

  it("rejects unsupported distance unit", () => {
    const input = {
      preferredCurrencyCode: "INR",
      distanceUnit: "Yards",
    };

    const parsed = profileSchema.safeParse(input);
    expect(parsed.success).toBe(false);
  });

  it("rejects vehicle name exceeding 100 characters", () => {
    const input = {
      preferredCurrencyCode: "INR",
      distanceUnit: "Kilometers",
      defaultVehicleName: "A".repeat(101),
    };

    const parsed = profileSchema.safeParse(input);
    expect(parsed.success).toBe(false);
  });

  it("rejects non-positive or excessive tank capacity", () => {
    expect(
      profileSchema.safeParse({
        preferredCurrencyCode: "INR",
        distanceUnit: "Kilometers",
        defaultTankCapacityLitres: 0,
      }).success
    ).toBe(false);

    expect(
      profileSchema.safeParse({
        preferredCurrencyCode: "INR",
        distanceUnit: "Kilometers",
        defaultTankCapacityLitres: -5,
      }).success
    ).toBe(false);

    expect(
      profileSchema.safeParse({
        preferredCurrencyCode: "INR",
        distanceUnit: "Kilometers",
        defaultTankCapacityLitres: 1001,
      }).success
    ).toBe(false);
  });

  it("rejects non-positive or excessive fuel efficiency", () => {
    expect(
      profileSchema.safeParse({
        preferredCurrencyCode: "INR",
        distanceUnit: "Kilometers",
        defaultFuelEfficiencyKmPerLitre: 0,
      }).success
    ).toBe(false);

    expect(
      profileSchema.safeParse({
        preferredCurrencyCode: "INR",
        distanceUnit: "Kilometers",
        defaultFuelEfficiencyKmPerLitre: -15,
      }).success
    ).toBe(false);

    expect(
      profileSchema.safeParse({
        preferredCurrencyCode: "INR",
        distanceUnit: "Kilometers",
        defaultFuelEfficiencyKmPerLitre: 201,
      }).success
    ).toBe(false);
  });
});
