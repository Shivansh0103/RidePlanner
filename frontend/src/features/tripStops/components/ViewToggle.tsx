import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { TripStopsViewMode } from "../types/tripStopsViewMode";

interface ViewToggleProps {
  value: TripStopsViewMode;
  onChange: (mode: TripStopsViewMode) => void;
}

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <ToggleButtonGroup
      exclusive
      value={value}
      onChange={(_, newValue: TripStopsViewMode | null) => {
        if (newValue) {
          onChange(newValue);
        }
      }}
    >
      <ToggleButton value="list">List</ToggleButton>

      <ToggleButton value="timeline">Timeline</ToggleButton>
    </ToggleButtonGroup>
  );
}
