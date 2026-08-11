export interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

export interface PlaceLocation {
  placeId: string | null;
  displayName: string;
  formattedAddress: string;
  coordinates: Coordinates;
}