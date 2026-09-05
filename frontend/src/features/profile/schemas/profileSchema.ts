import { z } from "zod";

export const SUPPORTED_CURRENCIES = ["INR", "USD", "EUR", "GBP"] as const;
export const SUPPORTED_DISTANCE_UNITS = ["Kilometers", "Miles"] as const;

export const profileSchema = z.object({
  preferredCurrencyCode: z.enum(SUPPORTED_CURRENCIES, {
    message: "Currency must be one of: INR, USD, EUR, GBP.",
  }),
  distanceUnit: z.enum(SUPPORTED_DISTANCE_UNITS, {
    message: "Distance unit must be Kilometers or Miles.",
  }),
  defaultVehicleName: z
    .string()
    .max(100, "Vehicle name cannot exceed 100 characters.")
    .optional()
    .nullable(),
  defaultTankCapacityLitres: z
    .number({ message: "Tank capacity must be a valid number." })
    .positive("Tank capacity must be greater than zero.")
    .max(1000, "Tank capacity cannot exceed 1,000 litres.")
    .optional()
    .nullable(),
  defaultFuelEfficiencyKmPerLitre: z
    .number({ message: "Fuel efficiency must be a valid number." })
    .positive("Fuel efficiency must be greater than zero.")
    .max(200, "Fuel efficiency cannot exceed 200 km/L.")
    .optional()
    .nullable(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
