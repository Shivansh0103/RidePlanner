export type CreateTripStop = {
  name: string;
  arrivalDate: string;
  departureDate: string;
  notes?: string;
  displayOrder: number;
};