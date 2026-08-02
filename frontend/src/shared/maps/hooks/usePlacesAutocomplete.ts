import { useMemo } from "react";

import { useMapsLibrary } from "@vis.gl/react-google-maps";

import { PlacesService } from "../services";

export function usePlacesAutocomplete() {
  const placesLibrary = useMapsLibrary("places");

  const service = useMemo(() => {
    if (!placesLibrary) {
      return null;
    }

    return new PlacesService(
      new placesLibrary.AutocompleteService(),
    );
  }, [placesLibrary]);

  return {
    service,
    isLoaded: service !== null,
  };
}