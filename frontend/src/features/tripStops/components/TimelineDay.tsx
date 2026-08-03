import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PlaceIcon from "@mui/icons-material/Place";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

import { formatDate } from "@/shared/utils/date";

import type { TimelineGroup } from "../types/timelineGroup";
import type { TripStop } from "../types/tripStop";
import TripStopCard from "./TripStopCard";

type TimelineDayProps = {
  group: TimelineGroup;
  onEdit: (stop: TripStop) => void;
  onDelete: (stop: TripStop) => void;
  selectedStopId?: string | null;
  onStopSelect?: (stopId: string) => void;
};

export function TimelineDay({
  group,
  onEdit,
  onDelete,
  selectedStopId,
  onStopSelect,
}: TimelineDayProps) {
  const stopCountText = `${group.stopCount} ${group.stopCount === 1 ? "stop" : "stops"}`;

  return (
    <Box
      component="section"
      aria-label={`Day ${group.dayNumber}: ${formatDate(group.date)}`}
      sx={{ position: "relative" }}
    >
      <Paper
        variant="outlined"
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
      </Paper>

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
          {group.stops.map((stop, index) => (
            <Box key={stop.id}>
              {index > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    py: 1,
                    pl: { xs: 1.5, sm: 3 },
                  }}
                >
                  <Box
                    sx={{
                      width: "2px",
                      height: 16,
                      bgcolor: "primary.main",
                      borderRadius: 1,
                      opacity: 0.5,
                    }}
                  />
                </Box>
              )}
              <TripStopCard
                stop={stop}
                onEdit={onEdit}
                onDelete={onDelete}
                selected={stop.id === selectedStopId}
                onStopSelect={onStopSelect}
              />
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
