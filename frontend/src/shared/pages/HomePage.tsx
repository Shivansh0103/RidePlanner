import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function HomePage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h3">
        Ride Planner
      </Typography>

      <Typography color="text.secondary">
        Plan unforgettable motorcycle adventures with routes,
        hotels, expenses and itineraries.
      </Typography>

      <Button
        variant="contained"
        component={RouterLink}
        to="/trips"
      >
        View Trips
      </Button>
    </Stack>
  );
}