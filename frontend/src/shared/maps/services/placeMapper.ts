import type { PlaceLocation } from "../types";

export function mapGooglePlaceToPlaceLocation(
  place: google.maps.places.PlaceResult,
): PlaceLocation {
  return {
    placeId: place.place_id ?? "",
    displayName: place.name ?? "",
    formattedAddress: place.formatted_address ?? "",
    coordinates: {
      latitude: place.geometry?.location?.lat() ?? 0,
      longitude: place.geometry?.location?.lng() ?? 0,
    },
  };
}