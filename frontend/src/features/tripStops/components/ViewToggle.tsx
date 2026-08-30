import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import TimelineIcon from "@mui/icons-material/Timeline";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";

import type { TripStopsViewMode } from "../types/tripStopsViewMode";

interface ViewToggleProps {
  value: TripStopsViewMode;
  onChange: (mode: TripStopsViewMode) => void;
}

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <Box
      className="neo-inset"
      sx={{
        display: "inline-flex",
        p: "3px",
        borderRadius: 2,
        bgcolor: "#141313",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
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
        sx={{
          gap: "3px",
          "& .MuiToggleButtonGroup-grouped": {
            border: "none !important",
            borderRadius: "6px !important",
            mx: 0,
          },
        }}
      >
        <ToggleButton
          value="list"
          aria-label="Switch to List view"
          sx={{
            px: 1.5,
            py: 0.5,
            gap: 0.8,
            color: "#94a3b8",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "none",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.05)",
              color: "#f8fafc",
            },
            "&.Mui-selected": {
              bgcolor: "#222228 !important",
              color: "#bef264 !important",
              border: "1px solid rgba(190, 242, 100, 0.35) !important",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
              "& .toggle-icon": {
                color: "#bef264",
              },
            },
          }}
        >
          <FormatListBulletedIcon className="toggle-icon" sx={{ fontSize: 15, color: value === "list" ? "#bef264" : "#71717a" }} />
          List
        </ToggleButton>

        <ToggleButton
          value="timeline"
          aria-label="Switch to Timeline view"
          sx={{
            px: 1.5,
            py: 0.5,
            gap: 0.8,
            color: "#94a3b8",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "none",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.05)",
              color: "#f8fafc",
            },
            "&.Mui-selected": {
              bgcolor: "#222228 !important",
              color: "#bef264 !important",
              border: "1px solid rgba(190, 242, 100, 0.35) !important",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
              "& .toggle-icon": {
                color: "#bef264",
              },
            },
          }}
        >
          <TimelineIcon className="toggle-icon" sx={{ fontSize: 15, color: value === "timeline" ? "#bef264" : "#71717a" }} />
          Timeline
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
