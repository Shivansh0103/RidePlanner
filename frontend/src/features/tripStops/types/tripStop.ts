import { TripStopCategory } from "./tripStopCategory";

export { TripStopCategory };

export type TripStop = {
  id: string;
  name: string;
  category?: TripStopCategory;
  arrivalDate: string;
  departureDate: string;
  notes: string | null;
  displayOrder: number;
};