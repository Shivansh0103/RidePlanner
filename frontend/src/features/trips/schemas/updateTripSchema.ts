import type { CreateTripRequest } from "./createTripSchema";

export type UpdateTripRequest = CreateTripRequest & {
  id: string;
};