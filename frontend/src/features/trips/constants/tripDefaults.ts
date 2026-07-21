import type { CreateTripRequest } from "../schemas/createTripSchema";

export const tripDefaults: CreateTripRequest = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
};