import { mapGooglePlaceToPlaceLocation } from "./placeMapper";

import type { PlaceLocation, PlaceSuggestion } from "../types";

export class PlacesService {
  async searchSuggestions(
    input: string,
    sessionToken: google.maps.places.AutocompleteSessionToken,
  ): Promise<PlaceSuggestion[]> {
    if (!input.trim()) {
      return [];
    }

    const { AutocompleteSuggestion } =
      await google.maps.importLibrary(
        "places",
      ) as google.maps.PlacesLibrary;

    const { suggestions } =
      await AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input,
        sessionToken,
      });

    return suggestions
      .filter((suggestion) => suggestion.placePrediction)
      .map((suggestion) => ({
        text: suggestion.placePrediction!.text.toString(),
        prediction: suggestion.placePrediction!,
      }));
  }

  async resolveSuggestion(
    suggestion: PlaceSuggestion,
  ): Promise<PlaceLocation> {
    const place = suggestion.prediction.toPlace();

    await place.fetchFields({
      fields: [
        "id",
        "displayName",
        "formattedAddress",
        "location",
      ],
    });

    return mapGooglePlaceToPlaceLocation(place);
  }
}