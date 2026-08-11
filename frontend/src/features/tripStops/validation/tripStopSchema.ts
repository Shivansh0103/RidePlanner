import { z } from "zod";

import { TripStopCategory } from "../types/tripStopCategory";

export const tripStopSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name cannot exceed 100 characters"),

    placeId: z.string().nullable().optional(),

    formattedAddress: z.string().min(1, "Location is required"),

    latitude: z.number().nullable().optional(),

    longitude: z.number().nullable().optional(),

    category: z.nativeEnum(TripStopCategory, {
      message: "Category is required",
    }),

    arrivalDate: z.string().min(1, "Arrival date is required"),

    departureDate: z.string().min(1, "Departure date is required"),

    notes: z.string().max(500).optional(),

    displayOrder: z.number().optional(),
  })
  .refine(
    (data) => data.departureDate >= data.arrivalDate,
    {
      message: "Departure date cannot be before arrival date",
      path: ["departureDate"],
    }
  );

export type TripStopFormValues = z.infer<typeof tripStopSchema>;