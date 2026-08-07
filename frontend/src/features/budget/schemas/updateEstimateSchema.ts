import { z } from "zod";

export const updateEstimateSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  estimatedAmount: z
    .number({ message: "Estimated amount must be a number" })
    .min(0, "Estimated amount cannot be negative"),
});

export type UpdateEstimateRequest = z.infer<typeof updateEstimateSchema>;
