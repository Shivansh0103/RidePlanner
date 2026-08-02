import { TripStopCategory } from "./tripStopCategory";

export type CreateTripStop = {
  name: string;

  placeId: string;

  formattedAddress: string;

  latitude: number;

  longitude: number;

  category: TripStopCategory;

  arrivalDate: string;

  departureDate: string;

  notes?: string;

  displayOrder?: number;
};