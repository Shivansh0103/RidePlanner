import { TripStopCategory } from "./tripStopCategory";

export { TripStopCategory };

export type TripStop = {
  id: string;

  name: string;

  placeId: string;

  formattedAddress: string;

  latitude: number;

  longitude: number;

  category?: TripStopCategory;

  arrivalDate: string;

  departureDate: string;

  notes: string | null;

  displayOrder: number;
};