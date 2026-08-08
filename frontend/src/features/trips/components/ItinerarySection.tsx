import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import TripStopDialog from "@/features/tripStops/components/TripStopDialog";
import TripStopsView from "@/features/tripStops/components/TripStopsView";
import { useDeleteTripStop } from "@/features/tripStops/hooks/useDeleteTripStop";
import { useReorderTripStops } from "@/features/tripStops/hooks/useReorderTripStops";
import { useTripStops } from "@/features/tripStops/hooks/useTripStops";
import type { TripStop } from "@/features/tripStops/types/tripStop";
import { TripStopCategory } from "@/features/tripStops/types/tripStopCategory";
import { useRoute } from "@/shared/maps";
import type { RouteLeg } from "@/shared/maps/types/route";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import EmptyState from "@/shared/ui/EmptyState";
import ErrorState from "@/shared/ui/ErrorState";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";

type ItinerarySectionProps = {
  tripId: string;
  selectedStopId?: string | null;
  onStopSelect?: (stopId: string) => void;
  routeLegs?: RouteLeg[];
};

export default function ItinerarySection({
  tripId,
  selectedStopId,
  onStopSelect,
  routeLegs: propsRouteLegs,
}: ItinerarySectionProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedStop, setSelectedStop] = useState<TripStop | null>(null);
  const [stopToDelete, setStopToDelete] = useState<TripStop | null>(null);

  const { data: stops = [], isLoading, isError } = useTripStops(tripId);
  const deleteTripStopMutation = useDeleteTripStop(tripId);
  const reorderTripStopsMutation = useReorderTripStops(tripId);

  const validStops = stops.filter((stop) => stop.latitude !== null && stop.longitude !== null);
  const { route } = useRoute(validStops);
  const routeLegs = propsRouteLegs ?? route?.legs ?? [];

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

  const handleReorderStops = (orderedStopIds: string[]) => {
    reorderTripStopsMutation.mutate(orderedStopIds);
  };

  const addStopButton = (
    <Button
      variant="contained"
      startIcon={<AddLocationAltIcon />}
      onClick={handleOpenCreateDialog}
      aria-label="Add a new stop to itinerary"
      sx={{ fontWeight: 600 }}
    >
      Add Stop
    </Button>
  );

  return (
    <>
      <Card
        component="section"
        aria-labelledby="itinerary-heading"
        variant="outlined"
        sx={{ borderRadius: 2 }}
      >
        <CardHeader
          title={
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Typography
                id="itinerary-heading"
                component="h2"
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                Itinerary
              </Typography>
              {stops.length > 0 && (
                <Chip
                  label={`${stops.length} ${stops.length === 1 ? "stop" : "stops"}`}
                  size="small"
                  variant="outlined"
                  aria-label={`Total ${stops.length} ${stops.length === 1 ? "stop" : "stops"}`}
                  sx={{ fontWeight: 500, color: "text.secondary" }}
                />
              )}
            </Stack>
          }
          sx={{
            py: { xs: 1.5, sm: 2 },
            px: { xs: 2, sm: 3 },
            "& .MuiCardHeader-action": {
              m: 0,
              alignSelf: "center",
            },
          }}
        />

        <Divider />

        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <ErrorState message="Unable to load itinerary." />
          ) : stops.length === 0 ? (
            <EmptyState
              icon={<AltRouteIcon sx={{ fontSize: 56 }} />}
              title="No stops yet"
              description="Add your first stop to start planning your journey."
              action={
                <Button
                  variant="contained"
                  startIcon={<AddLocationAltIcon />}
                  onClick={handleOpenCreateDialog}
                >
                  Add First Stop
                </Button>
              }
            />
          ) : (
            <TripStopsView
              stops={stops}
              onEdit={handleEditStop}
              onDelete={handleDeleteStop}
              onReorder={handleReorderStops}
              headerAction={addStopButton}
              routeLegs={routeLegs}
              selectedStopId={selectedStopId}
              onStopSelect={onStopSelect}
            />
          )}
        </CardContent>
      </Card>

      <TripStopDialog
        open={isCreateDialogOpen}
        tripId={tripId}
        mode="create"
        defaultValues={{
          name: "",
          placeId: "",
          formattedAddress: "",
          latitude: 0,
          longitude: 0,
          category: TripStopCategory.Destination,
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
            placeId: selectedStop.placeId,
            formattedAddress: selectedStop.formattedAddress,
            latitude: selectedStop.latitude,
            longitude: selectedStop.longitude,
            category: selectedStop.category ?? TripStopCategory.Destination,
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
