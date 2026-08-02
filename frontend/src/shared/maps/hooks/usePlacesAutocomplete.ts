import { useCallback, useMemo, useRef } from "react";

import { PlacesService } from "../services";

export function usePlacesAutocomplete() {
  const service = useMemo(() => new PlacesService(), []);

  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  const getSessionToken = useCallback(async () => {
    if (sessionTokenRef.current) {
      return sessionTokenRef.current;
    }

    const { AutocompleteSessionToken } =
      await google.maps.importLibrary(
        "places",
      ) as google.maps.PlacesLibrary;

    sessionTokenRef.current = new AutocompleteSessionToken();

    return sessionTokenRef.current;
  }, []);

  const resetSession = useCallback(() => {
    sessionTokenRef.current = null;
  }, []);

  return {
    service,
    getSessionToken,
    resetSession,
    isLoaded: true,
  };
}