import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import TripStopList from "@/features/tripStops/components/TripStopList";
import { useTripStops } from "@/features/tripStops/hooks/useTripStops";

type ItinerarySectionProps = {
  tripId: string;
};

export default function ItinerarySection({ tripId }: ItinerarySectionProps) {
  const { data: stops, isLoading, isError } = useTripStops(tripId);

  return (
    <Card>
      <CardHeader
        title="Itinerary"
        action={
          stops && stops.length > 0 ? (
            <Button variant="contained" startIcon={<AddLocationAltIcon />}>
              Add Stop
            </Button>
          ) : null
        }
      />

      <Divider />

      <CardContent>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert severity="error">Unable to load itinerary.</Alert>
        ) : stops?.length === 0 ? (
          <Stack
            spacing={3}
            sx={{
              alignItems: "center",
              py: 4,
            }}
          >
            <AltRouteIcon
              sx={{
                fontSize: 56,
                color: "action.disabled",
              }}
            />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
              }}
            >
              No stops yet
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                textAlign: "center",
                maxWidth: 360,
              }}
            >
              Add your first stop to start planning your journey.
            </Typography>

            <Button variant="contained" startIcon={<AddLocationAltIcon />}>
              Add First Stop
            </Button>
          </Stack>
        ) : (
          <TripStopList stops={stops} />
        )}
      </CardContent>
    </Card>
  );
}
