import { z } from "zod";

export const tripStopSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name cannot exceed 100 characters"),

    arrivalDate: z.string().min(1, "Arrival date is required"),

    departureDate: z.string().min(1, "Departure date is required"),

    notes: z.string().max(500).optional(),

    displayOrder: z.coerce
      .number()
      .int()
      .positive("Display order must be greater than 0"),
  })
  .refine(
    (data) => data.departureDate >= data.arrivalDate,
    {
      message: "Departure date cannot be before arrival date",
      path: ["departureDate"],
    }
  );

export type TripStopFormValues = z.infer<typeof tripStopSchema>;