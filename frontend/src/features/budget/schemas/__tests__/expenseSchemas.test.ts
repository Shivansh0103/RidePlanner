import { describe, expect, it } from "vitest";

import { expenseSchema } from "../expenseSchemas";

describe("expenseSchema validation", () => {
  it("validates a valid expense entry", () => {
    const validData = {
      title: "Petrol Fill - IndianOil",
      amount: 1450.5,
      category: "Fuel" as const,
      expenseDate: "2026-09-02",
      paymentMethod: "UPI" as const,
    };

    const result = expenseSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when amount is zero or negative", () => {
    const invalidData = {
      title: "Snacks",
      amount: 0,
      category: "Food" as const,
      expenseDate: "2026-09-02",
    };

    const result = expenseSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails when title is empty", () => {
    const invalidData = {
      title: "",
      amount: 500,
      category: "Food" as const,
      expenseDate: "2026-09-02",
    };

    const result = expenseSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
