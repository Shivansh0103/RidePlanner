import Grid from "@mui/material/Grid";

import type { Trip } from "../types/trip";
import TripCard from "./TripCard";

type TripListProps = {
  trips: Trip[];
};

export default function TripList({ trips }: TripListProps) {
  return (
    <Grid container spacing={3}>
      {trips.map((trip) => (
        <Grid
          key={trip.id}
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <TripCard trip={trip} />
        </Grid>
      ))}
    </Grid>
  );
}