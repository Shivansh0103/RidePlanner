import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Autocomplete,
  Box,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useDebounce } from "@/shared/hooks";

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
  placeholder = "Search for a city, landmark, or pass...",
  disabled = false,
}: PlaceAutocompleteProps) {
  const [options, setOptions] = useState<PlaceSuggestion[]>([]);
  const [inputValue, setInputValue] = useState(value?.displayName ?? "");
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(inputValue.trim(), 300);
  const { service, getSessionToken, resetSession, isLoaded } = usePlacesAutocomplete();

  useEffect(() => {
    if (!isLoaded || !debouncedQuery) {
      setOptions([]);
      return;
    }

    let isCancelled = false;

    async function fetchSuggestions() {
      try {
        setLoading(true);
        const sessionToken = await getSessionToken();
        const suggestions = await service.searchSuggestions(debouncedQuery, sessionToken);

        if (!isCancelled) {
          setOptions(suggestions);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Failed to fetch suggestions", error);
          setOptions([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchSuggestions();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, service, isLoaded, getSessionToken]);

  return (
    <Box>
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
        noOptionsText={debouncedQuery.length > 1 ? "No matching locations found" : "Type to search locations..."}
        isOptionEqualToValue={(a, b) => a.text === b.text}
        slotProps={{
          paper: {
            className: "neo-convex",
            sx: {
              bgcolor: "#1e1e24 !important",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 2,
              boxShadow: "0 12px 36px rgba(0,0,0,0.8)",
              mt: 0.5,
              "& .MuiAutocomplete-listbox": {
                py: 0.5,
              },
            },
          },
        }}
        renderOption={(props, option) => {
          const parts = option.text.split(",");
          const mainText = parts[0];
          const secondaryText = parts.slice(1).join(",").trim();

          return (
            <li
              {...props}
              style={{
                padding: "8px 14px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", width: "100%" }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: 1.5,
                    bgcolor: "rgba(99, 102, 241, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#818cf8",
                    flexShrink: 0,
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: 16 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#f8fafc",
                      fontSize: "0.84rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {mainText}
                  </Typography>
                  {secondaryText && (
                    <Typography
                      className="font-mono"
                      sx={{
                        color: "#94a3b8",
                        fontSize: "0.7rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {secondaryText}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            fullWidth
          />
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

      {/* Selected Coordinates & Address Feedback */}
      {value?.coordinates?.latitude && value?.coordinates?.longitude && (
        <Box
          className="neo-inset font-mono"
          sx={{
            mt: 1,
            px: 1.5,
            py: 0.8,
            borderRadius: 1.5,
            bgcolor: "#141313",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.68rem",
            color: "#bef264",
          }}
        >
          <Typography className="font-mono" sx={{ fontSize: "0.68rem", color: "#bef264" }}>
            📍 GPS: {value.coordinates.latitude.toFixed(4)}°, {value.coordinates.longitude.toFixed(4)}°
          </Typography>
          <Typography className="font-mono" sx={{ fontSize: "0.68rem", color: "#94a3b8" }}>
            {value.displayName || "Position Locked"}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
