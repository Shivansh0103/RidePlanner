import { Stack } from "@mui/material";

import type { TripStop } from "../types/tripStop";
import TripStopCard from "./TripStopCard";

type TripStopListProps = {
  stops: TripStop[];
};

export default function TripStopList({
  stops,
}: TripStopListProps) {
  return (
    <Stack spacing={2}>
      {stops.map((stop) => (
        <TripStopCard
          key={stop.id}
          stop={stop}
        />
      ))}
    </Stack>
  );
}