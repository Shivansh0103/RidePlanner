import { useEffect, useState } from "react";

import { Autocomplete, CircularProgress, TextField } from "@mui/material";

import { usePlacesAutocomplete } from "../hooks/usePlacesAutocomplete";

import type { PlaceLocation, PlaceSuggestion } from "../types";

interface PlaceAutocompleteProps {
  value: PlaceLocation | null;

  onPlaceSelected: (place: PlaceLocation | null) => void;

  label?: string;

  placeholder?: string;

  disabled?: boolean;
}

export function PlaceAutocomplete({
  value,
  onPlaceSelected,
  label = "Location",
  placeholder = "Search for a place...",
  disabled = false,
}: PlaceAutocompleteProps) {
  const [options, setOptions] = useState<PlaceSuggestion[]>([]);
  const [inputValue, setInputValue] = useState(value?.displayName ?? "");
  const [loading, setLoading] = useState(false);

  const { service, getSessionToken, resetSession, isLoaded } = usePlacesAutocomplete();

  useEffect(() => {
    if (!isLoaded || !inputValue.trim()) {
      setOptions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const sessionToken = await getSessionToken();

        const suggestions = await service.searchSuggestions(inputValue, sessionToken);

        setOptions(suggestions);
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [inputValue, service, isLoaded, getSessionToken]);

  return (
    <Autocomplete<PlaceSuggestion, false, false, false>
      options={options}
      loading={loading}
      inputValue={inputValue}
      onInputChange={(_, value) => {
        setInputValue(value);
      }}
      getOptionLabel={(option) => option.text}
      filterOptions={(x) => x}
      disabled={disabled}
      noOptionsText="Search for a location"
      isOptionEqualToValue={(a, b) => a.text === b.text}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} fullWidth />
      )}
      onChange={async (_, suggestion) => {
        if (!suggestion) {
          onPlaceSelected(null);
          resetSession();
          return;
        }

        try {
          const place = await service.resolveSuggestion(suggestion);

          onPlaceSelected(place);
        } catch (error) {
          console.error("Failed to resolve place", error);

          onPlaceSelected(null);
        } finally {
          resetSession();
        }
      }}
    />
  );
}
