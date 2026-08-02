export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PlaceLocation {
  placeId: string;
  displayName: string;
  formattedAddress: string;
  coordinates: Coordinates;
}