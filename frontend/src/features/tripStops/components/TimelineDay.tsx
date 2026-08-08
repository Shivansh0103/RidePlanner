import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlaceIcon from "@mui/icons-material/Place";
import { Box, Chip, Collapse, IconButton, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";

import type { RouteLeg } from "@/shared/maps/types/route";
import { formatDate } from "@/shared/utils/date";

import type { TimelineGroup } from "../types/timelineGroup";
import type { TripStop } from "../types/tripStop";
import RouteLegConnector, { formatLegDistance, formatLegDuration } from "./RouteLegConnector";
import TripStopCard from "./TripStopCard";

type TimelineDayProps = {
  group: TimelineGroup;
  onEdit: (stop: TripStop) => void;
  onDelete: (stop: TripStop) => void;
  routeLegs?: RouteLeg[];

  selectedStopId?: string | null;
  onStopSelect?: (stopId: string) => void;

  registerRef?: (stopId: string) => (element: HTMLDivElement | null) => void;
};

export function TimelineDay({
  group,
  onEdit,
  onDelete,
  routeLegs = [],
  selectedStopId,
  onStopSelect,
  registerRef,
}: TimelineDayProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const stopCountText = `${group.stopCount} ${group.stopCount === 1 ? "stop" : "stops"}`;

  const legMapByEndStop = new Map<string, RouteLeg>();
  for (const leg of routeLegs) {
    if (leg.endStopId) {
      legMapByEndStop.set(leg.endStopId, leg);
    }
  }

  const hasDayMetrics =
    group.totalDistanceMeters !== undefined && group.totalDurationMillis !== undefined;
  const dayDistanceText = hasDayMetrics ? formatLegDistance(group.totalDistanceMeters!) : "";
  const dayDurationText = hasDayMetrics ? formatLegDuration(group.totalDurationMillis!) : "";

  return (
    <Box
      component="section"
      aria-label={`Day ${group.dayNumber}: ${formatDate(group.date)}`}
      sx={{ position: "relative" }}
    >
      <Paper
        variant="outlined"
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{
          p: { xs: 1.5, sm: 2 },
          mb: { xs: 2, sm: 2.5 },
          borderRadius: 2,
          bgcolor: "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          cursor: "pointer",
          transition: "background-color 0.2s ease-in-out, border-color 0.2s ease-in-out",
          "&:hover": {
            bgcolor: "action.selected",
          },
        }}
      >
        <Stack
          direction="row"
          spacing={{ xs: 1, sm: 1.5 }}
          sx={{ alignItems: "center", flexWrap: "wrap" }}
        >
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 1.5,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontWeight: 700,
              fontSize: "0.875rem",
              lineHeight: 1.2,
              letterSpacing: "0.02em",
            }}
          >
            Day {group.dayNumber}
          </Box>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <CalendarTodayIcon fontSize="small" color="action" />
            <Typography
              component="h3"
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                fontSize: { xs: "0.95rem", sm: "1rem" },
              }}
            >
              {formatDate(group.date)}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          {hasDayMetrics && (
            <Chip
              icon={<DirectionsCarIcon fontSize="small" />}
              label={`${dayDistanceText} • ${dayDurationText}`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{
                fontWeight: 600,
                bgcolor: "background.paper",
                fontSize: "0.75rem",
              }}
            />
          )}

          <Chip
            icon={<PlaceIcon fontSize="small" />}
            label={stopCountText}
            size="small"
            variant="outlined"
            aria-label={`${stopCountText} scheduled for Day ${group.dayNumber}`}
            sx={{
              fontWeight: 500,
              bgcolor: "background.paper",
              borderColor: "divider",
            }}
          />

          <IconButton size="small" onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}>
            {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Stack>
      </Paper>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box
          sx={{
            ml: { xs: 1, sm: 2.5 },
            pl: { xs: 1.5, sm: 3 },
            borderLeft: "2px dashed",
            borderColor: "divider",
            pb: 1,
          }}
        >
          <Stack spacing={0}>
            {group.stops.map((stop, index) => {
              const leg = legMapByEndStop.get(stop.id);

              return (
                <Box key={stop.id}>
                  {index > 0 && leg && (
                    <RouteLegConnector
                      distanceMeters={leg.distanceMeters}
                      durationMillis={leg.durationMillis}
                    />
                  )}

                  <TripStopCard
                    ref={registerRef?.(stop.id)}
                    stop={stop}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    selected={stop.id === selectedStopId}
                    onStopSelect={onStopSelect}
                  />
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}
