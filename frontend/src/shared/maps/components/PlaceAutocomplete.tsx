import { useState } from "react";

import { Autocomplete, TextField } from "@mui/material";

import type { PlaceLocation, PlacePrediction } from "../types";
import { useEffect } from "react";

import { usePlacesAutocomplete } from "../hooks/usePlacesAutocomplete";

export interface PlaceAutocompleteProps {
  value?: PlaceLocation | null;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  onPlaceSelected: (place: PlaceLocation | null) => void;
}

export function PlaceAutocomplete({
  value,
  label = "Location",
  placeholder = "Search for a place...",
  disabled = false,
}: PlaceAutocompleteProps) {
  const [options, setOptions] = useState<PlacePrediction[]>([]);
  const [inputValue, setInputValue] = useState(value?.displayName ?? "");
  const { service, isLoaded } = usePlacesAutocomplete();

  useEffect(() => {
    if (!isLoaded || !service) {
      return;
    }

    const timeout = setTimeout(async () => {
      const predictions = await service.searchPredictions(inputValue);

      setOptions(predictions);
    }, 300);

    return () => clearTimeout(timeout);
  }, [inputValue, service, isLoaded]);
  return (
    <Autocomplete<PlacePrediction, false, false, false>
      options={options}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      getOptionLabel={(option) => option.text}
      isOptionEqualToValue={(option, selected) => option.placeId === selected.placeId}
      disabled={disabled}
      filterOptions={(x) => x}
      noOptionsText="Search for a location"
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} fullWidth />
      )}
      onChange={() => {
        // Will be implemented in the next step.
      }}
    />
  );
}
