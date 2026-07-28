import { useState } from "react";

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

import TripStopDialog from "@/features/tripStops/components/TripStopDialog";
import TripStopList from "@/features/tripStops/components/TripStopList";
import { useTripStops } from "@/features/tripStops/hooks/useTripStops";

type ItinerarySectionProps = {
  tripId: string;
};

export default function ItinerarySection({ tripId }: ItinerarySectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: stops = [], isLoading, isError } = useTripStops(tripId);

  const nextDisplayOrder = Math.max(0, ...stops.map((stop) => stop.displayOrder)) + 1;

  return (
    <>
      <Card>
        <CardHeader
          title="Itinerary"
          action={
            stops.length > 0 ? (
              <Button
                variant="contained"
                startIcon={<AddLocationAltIcon />}
                onClick={() => setIsDialogOpen(true)}
              >
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
          ) : stops.length === 0 ? (
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

              <Button
                variant="contained"
                startIcon={<AddLocationAltIcon />}
                onClick={() => setIsDialogOpen(true)}
              >
                Add First Stop
              </Button>
            </Stack>
          ) : (
            <TripStopList stops={stops} />
          )}
        </CardContent>
      </Card>

      {isDialogOpen && (
        <TripStopDialog
          open
          tripId={tripId}
          nextDisplayOrder={nextDisplayOrder}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
}
