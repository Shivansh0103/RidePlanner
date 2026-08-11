import { TripStopCategory } from "./tripStopCategory";

export type CreateTripStop = {
  name: string;

  placeId?: string | null;

  formattedAddress: string;

  latitude?: number | null;

  longitude?: number | null;

  category: TripStopCategory;

  arrivalDate: string;

  departureDate: string;

  notes?: string;

  displayOrder?: number;
};