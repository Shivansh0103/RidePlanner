import Grid from "@mui/material/Grid";

import TripCard from "./TripCard";
import type { Trip } from "../types/trip";

type TripListProps = {
  trips: Trip[];
  onEdit: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
};

export default function TripList({ trips, onEdit, onDelete }: TripListProps) {
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
          <TripCard trip={trip} onEdit={onEdit} onDelete={onDelete} />
        </Grid>
      ))}
    </Grid>
  );
}
