import { Card, CardContent, Stack, Typography } from "@mui/material";
import type { TimelineGroup } from "../types/timelineGroup";
import type { TripStop } from "../types/tripStop";
import { formatDate } from "@/shared/utils/date";
import TripStopCard from "./TripStopCard";

type TimelineDayProps = {
  group: TimelineGroup;
  onEdit: (stop: TripStop) => void;
  onDelete: (stop: TripStop) => void;
};

export function TimelineDay({ group, onEdit, onDelete }: TimelineDayProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6">Day {group.dayNumber}</Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {formatDate(group.date)}
        </Typography>

        <Stack spacing={2} sx={{ mt: 2 }}>
          {group.stops.map((stop) => (
            <TripStopCard key={stop.id} stop={stop} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
