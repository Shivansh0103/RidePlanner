import { Stack } from "@mui/material";

import type { TripStop } from "../types/tripStop";
import TripStopCard from "./TripStopCard";

type TripStopListProps = {
  stops: TripStop[];
  onEdit: (stop: TripStop) => void;
  onDelete: (stop: TripStop) => void;
};

export default function TripStopList({ stops, onEdit, onDelete }: TripStopListProps) {
  return (
    <Stack spacing={2.5}>
      {stops.map((stop) => (
        <TripStopCard key={stop.id} stop={stop} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </Stack>
  );
}
