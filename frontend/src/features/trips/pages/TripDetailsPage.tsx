import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import ErrorState from "@/shared/ui/ErrorState";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";

import ItinerarySection from "../components/ItinerarySection";
import TripSummarySection from "../components/TripSummarySection";
import { useTrip } from "../hooks/useTrip";

export default function TripDetailsPage() {
  const navigate = useNavigate();

  const { tripId } = useParams();

  const { data: trip, isLoading, isError } = useTrip(tripId ?? "");

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !trip) {
    return <ErrorState message="Unable to load trip." />;
  }

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        width: "100%",
      }}
    >
      <Stack spacing={4}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/trips")}
          sx={{
            alignSelf: "flex-start",
            px: 0,
          }}
        >
          Back to Trips
        </Button>

        <Stack spacing={0.5}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
            }}
          >
            {trip.name}
          </Typography>

          {trip.description && <Typography color="text.secondary">{trip.description}</Typography>}
        </Stack>

        <TripSummarySection trip={trip} />

        <ItinerarySection tripId={trip.id} />
      </Stack>
    </Box>
  );
}
