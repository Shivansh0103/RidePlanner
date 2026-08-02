import type { PlaceLocation } from "../types";

export function mapGooglePlaceToPlaceLocation(
  place: google.maps.places.Place,
): PlaceLocation {
  return {
    placeId: place.id ?? "",

    displayName: place.displayName ?? "",

    formattedAddress: place.formattedAddress ?? "",

    coordinates: {
      latitude: place.location?.lat() ?? 0,
      longitude: place.location?.lng() ?? 0,
    },
  };
}