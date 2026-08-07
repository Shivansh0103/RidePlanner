import { z } from "zod";

export const createEstimateSchema = z.object({
  category: z.enum([
    "Fuel",
    "Accommodation",
    "Food",
    "TollsAndPermits",
    "Miscellaneous",
  ]),
  name: z.string().trim().min(1, "Name is required"),
  estimatedAmount: z
    .number({ message: "Estimated amount must be a number" })
    .min(0, "Estimated amount cannot be negative"),
});

export type CreateEstimateRequest = z.infer<typeof createEstimateSchema>;
