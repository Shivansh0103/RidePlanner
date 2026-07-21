import { z } from "zod";

export const tripSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Trip name must be at least 3 characters.")
    .max(100, "Trip name cannot exceed 100 characters."),
});

export type TripFormValues = z.infer<typeof tripSchema>;