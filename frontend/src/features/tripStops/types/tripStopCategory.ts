export const TripStopCategory = {
  Destination: 0,
  Hotel: 1,
  Fuel: 2,
  Food: 3,
  Break: 4,
  Attraction: 5,
  Checkpoint: 6,
} as const;

export type TripStopCategory = (typeof TripStopCategory)[keyof typeof TripStopCategory];
