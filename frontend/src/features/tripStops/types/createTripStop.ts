import { TripStopCategory } from "./tripStopCategory";

export type CreateTripStop = {
  name: string;
  category: TripStopCategory;
  arrivalDate: string;
  departureDate: string;
  notes?: string;
  displayOrder?: number;
};