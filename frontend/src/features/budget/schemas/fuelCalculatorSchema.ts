import { z } from "zod";

export const fuelCalculatorSchema = z.object({
  routeDistanceKm: z
    .number({ message: "Route distance must be a number" })
    .gt(0, "Route distance must be greater than 0"),
  vehicleMileage: z
    .number({ message: "Vehicle mileage must be a number" })
    .gt(0, "Vehicle mileage must be greater than 0"),
  fuelPricePerLiter: z
    .number({ message: "Fuel price must be a number" })
    .gt(0, "Fuel price must be greater than 0"),
});

export type FuelCalculatorRequest = z.infer<typeof fuelCalculatorSchema>;
