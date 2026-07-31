import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import TimelineIcon from "@mui/icons-material/Timeline";
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
      size="small"
      value={value}
      onChange={(_, newValue: TripStopsViewMode | null) => {
        if (newValue) {
          onChange(newValue);
        }
      }}
      aria-label="Itinerary view mode"
    >
      <ToggleButton
        value="list"
        aria-label="Switch to List view"
        sx={{
          px: 1.75,
          py: 0.75,
          gap: 1,
          fontWeight: 500,
          transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out",
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: "2px",
            zIndex: 1,
          },
        }}
      >
        <FormatListBulletedIcon fontSize="small" />
        List
      </ToggleButton>

      <ToggleButton
        value="timeline"
        aria-label="Switch to Timeline view"
        sx={{
          px: 1.75,
          py: 0.75,
          gap: 1,
          fontWeight: 500,
          transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out",
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: "2px",
            zIndex: 1,
          },
        }}
      >
        <TimelineIcon fontSize="small" />
        Timeline
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
