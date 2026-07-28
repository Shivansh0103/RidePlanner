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
import { useState } from "react";

import TripStopDialog from "@/features/tripStops/components/TripStopDialog";
import TripStopList from "@/features/tripStops/components/TripStopList";
import { useDeleteTripStop } from "@/features/tripStops/hooks/useDeleteTripStop";
import { useTripStops } from "@/features/tripStops/hooks/useTripStops";
import type { TripStop } from "@/features/tripStops/types/tripStop";
import ConfirmDialog from "@/shared/components/ConfirmDialog";

type ItinerarySectionProps = {
  tripId: string;
};

export default function ItinerarySection({ tripId }: ItinerarySectionProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedStop, setSelectedStop] = useState<TripStop | null>(null);
  const [stopToDelete, setStopToDelete] = useState<TripStop | null>(null);

  const { data: stops = [], isLoading, isError } = useTripStops(tripId);
  const deleteTripStopMutation = useDeleteTripStop(tripId);

  const nextDisplayOrder = Math.max(0, ...stops.map((stop) => stop.displayOrder)) + 1;

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleEditStop = (stop: TripStop) => {
    setSelectedStop(stop);
  };

  const handleCloseEditDialog = () => {
    setSelectedStop(null);
  };

  const handleDeleteStop = (stop: TripStop) => {
    setStopToDelete(stop);
  };

  const handleConfirmDelete = () => {
    if (!stopToDelete) return;

    deleteTripStopMutation.mutate(stopToDelete.id, {
      onSuccess: () => {
        setStopToDelete(null);
      },
    });
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Itinerary"
          action={
            stops.length > 0 && (
              <Button
                variant="contained"
                startIcon={<AddLocationAltIcon />}
                onClick={handleOpenCreateDialog}
              >
                Add Stop
              </Button>
            )
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
                onClick={handleOpenCreateDialog}
              >
                Add First Stop
              </Button>
            </Stack>
          ) : (
            <TripStopList stops={stops} onEdit={handleEditStop} onDelete={handleDeleteStop} />
          )}
        </CardContent>
      </Card>

      <TripStopDialog
        open={isCreateDialogOpen}
        tripId={tripId}
        mode="create"
        defaultValues={{
          name: "",
          arrivalDate: "",
          departureDate: "",
          notes: "",
          displayOrder: nextDisplayOrder,
        }}
        onClose={handleCloseCreateDialog}
      />

      {selectedStop && (
        <TripStopDialog
          open
          tripId={tripId}
          mode="edit"
          stopId={selectedStop.id}
          defaultValues={{
            name: selectedStop.name,
            arrivalDate: selectedStop.arrivalDate,
            departureDate: selectedStop.departureDate,
            notes: selectedStop.notes ?? "",
            displayOrder: selectedStop.displayOrder,
          }}
          onClose={handleCloseEditDialog}
        />
      )}

      <ConfirmDialog
        open={stopToDelete !== null}
        title="Delete Stop"
        message={`Are you sure you want to permanently delete "${stopToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleteTripStopMutation.isPending}
        onClose={() => setStopToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
