import { Box, Stack } from "@mui/material";

import type { RouteLeg } from "@/shared/maps/types/route";

import { useScrollToSelection } from "../hooks/useScrollToSelection";
import type { TripStop } from "../types/tripStop";
import { groupStopsByDay } from "../utils/groupStopsByDay";
import { TimelineDay } from "./TimelineDay";

type TripStopsTimelineViewProps = {
  stops: TripStop[];
  onEdit: (stop: TripStop) => void;
  onDelete: (stop: TripStop) => void;
  routeLegs?: RouteLeg[];

  selectedStopId?: string | null;
  onStopSelect?: (stopId: string) => void;
};

export function TripStopsTimelineView({
  stops,
  onEdit,
  onDelete,
  routeLegs,
  selectedStopId,
  onStopSelect,
}: TripStopsTimelineViewProps) {
  const groups = groupStopsByDay(stops, routeLegs);
  const { registerRef } = useScrollToSelection(selectedStopId);

  return (
    <Box role="region" aria-label="Trip stops timeline" sx={{ py: { xs: 0.5, sm: 1 } }}>
      <Stack spacing={{ xs: 3, sm: 4.5 }}>
        {groups.map((group) => (
          <TimelineDay
            key={group.date.toISOString()}
            group={group}
            onEdit={onEdit}
            onDelete={onDelete}
            routeLegs={routeLegs}
            selectedStopId={selectedStopId}
            onStopSelect={onStopSelect}
            registerRef={registerRef}
          />
        ))}
      </Stack>
    </Box>
  );
}
