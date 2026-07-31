import { groupStopsByDay } from "../utils/groupStopsByDay";
import type { TripStop } from "../types/tripStop";
import { Stack } from "@mui/material";
import { TimelineDay } from "./timelineDay";

type TripStopsTimelineViewProps = {
  stops: TripStop[];
  onEdit: (stop: TripStop) => void;
  onDelete: (stop: TripStop) => void;
};

export function TripStopsTimelineView({ stops, onEdit, onDelete }: TripStopsTimelineViewProps) {
  const groups = groupStopsByDay(stops);

  return (
    <Stack spacing={3}>
      {groups.map((group) => (
        <TimelineDay
          key={group.date.toISOString()}
          group={group}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Stack>
  );
}
