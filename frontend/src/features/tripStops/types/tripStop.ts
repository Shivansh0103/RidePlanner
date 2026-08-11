import { TripStopCategory } from "./tripStopCategory";

export { TripStopCategory };

export type TripStop = {
  id: string;

  name: string;

  placeId: string | null;

  formattedAddress: string;

  latitude: number | null;

  longitude: number | null;

  category?: TripStopCategory;

  arrivalDate: string;

  departureDate: string;

  notes: string | null;

  displayOrder: number;
};