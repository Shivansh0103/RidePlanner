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
        bgcolor: (theme) => theme.palette.mode === "dark" ? "#141313" : "#FFFFFF",
        border: "1px solid",
        borderColor: "divider",
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
            color: "text.secondary",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "none",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "action.hover",
              color: "text.primary",
            },
            "&.Mui-selected": {
              bgcolor: (theme) => theme.palette.mode === "dark" ? "#222228 !important" : "#EEF2FF !important",
              color: (theme) => theme.palette.mode === "dark" ? "#bef264 !important" : "#4F46E5 !important",
              border: (theme) => theme.palette.mode === "dark" ? "1px solid rgba(190, 242, 100, 0.35) !important" : "1px solid rgba(79, 70, 229, 0.35) !important",
              boxShadow: (theme) => theme.palette.mode === "dark" ? "0 2px 8px rgba(0, 0, 0, 0.4)" : "0 2px 8px rgba(0, 0, 0, 0.05)",
              "& .toggle-icon": {
                color: (theme) => theme.palette.mode === "dark" ? "#bef264" : "#4F46E5",
              },
            },
          }}
        >
          <FormatListBulletedIcon className="toggle-icon" sx={{ fontSize: 15 }} />
          List
        </ToggleButton>

        <ToggleButton
          value="timeline"
          aria-label="Switch to Timeline view"
          sx={{
            px: 1.5,
            py: 0.5,
            gap: 0.8,
            color: "text.secondary",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "none",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "action.hover",
              color: "text.primary",
            },
            "&.Mui-selected": {
              bgcolor: (theme) => theme.palette.mode === "dark" ? "#222228 !important" : "#EEF2FF !important",
              color: (theme) => theme.palette.mode === "dark" ? "#bef264 !important" : "#4F46E5 !important",
              border: (theme) => theme.palette.mode === "dark" ? "1px solid rgba(190, 242, 100, 0.35) !important" : "1px solid rgba(79, 70, 229, 0.35) !important",
              boxShadow: (theme) => theme.palette.mode === "dark" ? "0 2px 8px rgba(0, 0, 0, 0.4)" : "0 2px 8px rgba(0, 0, 0, 0.05)",
              "& .toggle-icon": {
                color: (theme) => theme.palette.mode === "dark" ? "#bef264" : "#4F46E5",
              },
            },
          }}
        >
          <TimelineIcon className="toggle-icon" sx={{ fontSize: 15 }} />
          Timeline
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
