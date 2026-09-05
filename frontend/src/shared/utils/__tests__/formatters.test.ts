import { describe, expect, it } from "vitest";

import { formatCurrency, formatDistance, formatDuration } from "../formatters";

describe("formatters utilities", () => {
  describe("formatDistance", () => {
    it("formats 0 or negative values as 0 m or 0 mi", () => {
      expect(formatDistance(0)).toBe("0 m");
      expect(formatDistance(-50)).toBe("0 m");
      expect(formatDistance(0, "Miles")).toBe("0 mi");
      expect(formatDistance(-50, "Miles")).toBe("0 mi");
    });

    it("formats distances under 1000m in meters when unit is Kilometers", () => {
      expect(formatDistance(450)).toBe("450 m");
      expect(formatDistance(999.4)).toBe("999 m");
    });

    it("formats distances >= 1000m in kilometers with 1 decimal", () => {
      expect(formatDistance(1000)).toBe("1.0 km");
      expect(formatDistance(42500)).toBe("42.5 km");
      expect(formatDistance(842400)).toBe("842.4 km");
    });

    it("formats distances in miles when unit is Miles", () => {
      // 100 km = 62.1 mi
      expect(formatDistance(100000, "Miles")).toBe("62.1 mi");
      // 842.4 km * 0.621371 = 523.4 mi
      expect(formatDistance(842400, "Miles")).toBe("523.4 mi");
    });
  });

  describe("formatDuration", () => {
    it("formats 0 or negative milliseconds as 0 min", () => {
      expect(formatDuration(0)).toBe("0 min");
      expect(formatDuration(-1000)).toBe("0 min");
    });

    it("formats durations under 1 hour in minutes", () => {
      expect(formatDuration(2700000)).toBe("45 min");
    });

    it("formats exact hour durations", () => {
      expect(formatDuration(3600000)).toBe("1 hr");
      expect(formatDuration(7200000)).toBe("2 hr");
    });

    it("formats composite hour and minute durations", () => {
      expect(formatDuration(48300000)).toBe("13 hr 25 min");
      expect(formatDuration(5400000)).toBe("1 hr 30 min");
    });
  });

  describe("formatCurrency", () => {
    it("formats invalid or undefined numbers as fallback ₹0", () => {
      expect(formatCurrency(0)).toBe("₹0");
      expect(formatCurrency(NaN)).toBe("₹0");
    });

    it("formats whole INR amounts without decimals by default", () => {
      const formatted = formatCurrency(14000);
      expect(formatted).toContain("14,000");
      expect(formatted).toContain("₹");
    });

    it("formats amounts with decimals to 2 decimal places", () => {
      const formatted = formatCurrency(4200.5);
      expect(formatted).toContain("4,200.50");
    });

    it("formats explicit USD currency with dollar sign", () => {
      const formatted = formatCurrency(250, "USD");
      expect(formatted).toContain("$");
      expect(formatted).toContain("250");
    });

    it("formats explicit GBP currency with pound sign", () => {
      const formatted = formatCurrency(150, "GBP");
      expect(formatted).toContain("£");
      expect(formatted).toContain("150");
    });

    it("formats explicit EUR currency with euro sign", () => {
      const formatted = formatCurrency(500, "EUR");
      expect(formatted).toContain("€");
      expect(formatted).toContain("500");
    });
  });
});
