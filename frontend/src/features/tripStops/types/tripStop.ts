export type TripStop = {
  id: string;
  name: string;
  arrivalDate: string;
  departureDate: string;
  notes: string | null;
  displayOrder: number;
};