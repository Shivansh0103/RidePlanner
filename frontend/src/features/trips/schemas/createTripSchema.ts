import { z } from "zod";

export const createTripSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Trip name must be at least 3 characters.")
      .max(100, "Trip name cannot exceed 100 characters."),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters."),

    startDate: z.string().min(1, "Start date is required."),

    endDate: z.string().min(1, "End date is required."),
  })
  .refine(
    data =>
      new Date(data.endDate) >=
      new Date(data.startDate),
    {
      path: ["endDate"],
      message:
        "End date must be on or after the start date.",
    }
  );

export type CreateTripRequest =
  z.infer<typeof createTripSchema>;