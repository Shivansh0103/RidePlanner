import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import HotelIcon from "@mui/icons-material/Hotel";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import AccommodationDialog from "@/features/accommodations/components/AccommodationDialog";
import { useAccommodations } from "@/features/accommodations/hooks/useAccommodations";
import { useCreateAccommodation } from "@/features/accommodations/hooks/useCreateAccommodation";
import { useUpdateAccommodation } from "@/features/accommodations/hooks/useUpdateAccommodation";
import type { AccommodationFormValues } from "@/features/accommodations/schemas/accommodationSchema";
import type { Accommodation } from "@/features/accommodations/types/accommodation";
import TripStopDialog from "@/features/tripStops/components/TripStopDialog";
import TripStopsView from "@/features/tripStops/components/TripStopsView";
import { useDeleteTripStop } from "@/features/tripStops/hooks/useDeleteTripStop";
import { useReorderTripStops } from "@/features/tripStops/hooks/useReorderTripStops";
import { useTripStops } from "@/features/tripStops/hooks/useTripStops";
import type { TripStopFormValues } from "@/features/tripStops/schemas/tripStopSchema";
import type { TripStop } from "@/features/tripStops/types/tripStop";
import { TripStopCategory } from "@/features/tripStops/types/tripStopCategory";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { useRoute } from "@/shared/maps";
import type { RouteLeg } from "@/shared/maps/types/route";
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
  const [isAccommodationDialogOpen, setIsAccommodationDialogOpen] = useState(false);
  const [selectedStop, setSelectedStop] = useState<TripStop | null>(null);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  const [stopToDelete, setStopToDelete] = useState<TripStop | null>(null);

  const { data: stops = [], isLoading, isError } = useTripStops(tripId);
  const { data: accommodations = [] } = useAccommodations(tripId);

  const createAccommodationMutation = useCreateAccommodation(tripId);
  const updateAccommodationMutation = useUpdateAccommodation(tripId);

  const deleteTripStopMutation = useDeleteTripStop(tripId);
  const reorderTripStopsMutation = useReorderTripStops(tripId);

  const validStops = stops.filter(
    (stop) =>
      stop.latitude !== null &&
      stop.longitude !== null &&
      (stop.latitude !== 0 || stop.longitude !== 0)
  );
  const { route } = useRoute(validStops);
  const routeLegs = propsRouteLegs ?? route?.legs ?? [];

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleOpenAccommodationDialog = (acc?: Accommodation | null) => {
    setEditingAccommodation(acc ?? null);
    setIsAccommodationDialogOpen(true);
  };

  const handleEditStop = (stop: TripStop) => {
    const linkedAcc = accommodations.find((a) => a.tripStopId === stop.id);
    if (linkedAcc || stop.category === TripStopCategory.Hotel) {
      handleOpenAccommodationDialog(linkedAcc);
    } else {
      setSelectedStop(stop);
    }
  };

  const handleAccommodationSubmit = async (values: AccommodationFormValues) => {
    const payload = {
      ...values,
      latitude: values.latitude ?? null,
      longitude: values.longitude ?? null,
    };
    if (editingAccommodation) {
      await updateAccommodationMutation.mutateAsync({
        id: editingAccommodation.id,
        payload,
      });
    } else {
      await createAccommodationMutation.mutateAsync(payload);
    }
    setIsAccommodationDialogOpen(false);
    setEditingAccommodation(null);
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
    <Stack direction="row" spacing={1.2}>
      <Button
        variant="outlined"
        size="small"
        startIcon={<HotelIcon sx={{ fontSize: 16 }} />}
        onClick={() => handleOpenAccommodationDialog(null)}
        sx={{
          borderColor: "rgba(190, 242, 100, 0.4)",
          color: "#bef264",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "0.72rem",
          fontWeight: 700,
          "&:hover": { borderColor: "#bef264", bgcolor: "rgba(190, 242, 100, 0.08)" },
        }}
      >
        Add Stay
      </Button>

      <Button
        variant="contained"
        size="small"
        startIcon={<AddLocationAltIcon sx={{ fontSize: 16 }} />}
        onClick={handleOpenCreateDialog}
        className="glow-indigo"
        aria-label="Add a new stop to itinerary"
        sx={{
          bgcolor: "#6366f1",
          color: "#ffffff",
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "0.72rem",
          fontWeight: 800,
          letterSpacing: "0.04em",
          "&:hover": { bgcolor: "#4f46e5" },
        }}
      >
        Add Waypoint
      </Button>
    </Stack>
  );

  const handleRedirectToAccommodation = (values: TripStopFormValues) => {
    setIsCreateDialogOpen(false);
    setSelectedStop(null);
    setEditingAccommodation({
      id: "",
      tripId,
      tripStopId: "",
      name: values.name,
      type: "Hotel",
      checkInDate: values.arrivalDate || new Date().toISOString().split("T")[0],
      checkOutDate: values.departureDate || new Date().toISOString().split("T")[0],
      checkInTime: null,
      checkOutTime: null,
      nights: 1,
      formattedAddress: values.formattedAddress,
      latitude: values.latitude ?? null,
      longitude: values.longitude ?? null,
      placeId: values.placeId ?? null,
      confirmationNumber: "",
      contactName: "",
      contactPhone: "",
      website: "",
      bookingNotes: values.notes ?? "",
      cost: 0,
      displayOrder: 1,
    });
    setIsAccommodationDialogOpen(true);
  };

  return (
    <>
      <Card
        component="section"
        aria-labelledby="itinerary-heading"
        className="neo-convex"
        sx={{
          borderRadius: 2.5,
          bgcolor: "#1a1a1e",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Box
          sx={{
            py: 2,
            px: { xs: 2, sm: 3 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Typography
              id="itinerary-heading"
              variant="h5"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 800,
                color: "#f8fafc",
              }}
            >
              Itinerary & Waypoint Sequence
            </Typography>
            {stops.length > 0 && (
              <Chip
                label={`${stops.length} ${stops.length === 1 ? "Waypoint" : "Waypoints"}`}
                size="small"
                sx={{
                  bgcolor: "rgba(99, 102, 241, 0.15)",
                  color: "#818cf8",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 700,
                  fontSize: "0.68rem",
                }}
              />
            )}
          </Stack>

          {addStopButton}
        </Box>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.06)" }} />

        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <ErrorState message="Unable to load itinerary." />
          ) : stops.length === 0 ? (
            <EmptyState
              icon={<AltRouteIcon sx={{ fontSize: 56, color: "#818cf8" }} />}
              title="No waypoints mapped yet"
              description="Establish your route sequence by adding your departure point, mountain passes, fuel stations, and overnight stays."
              action={
                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="outlined"
                    startIcon={<HotelIcon />}
                    onClick={() => handleOpenAccommodationDialog(null)}
                    sx={{ color: "#bef264", borderColor: "rgba(190, 242, 100, 0.4)" }}
                  >
                    Add Stay
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddLocationAltIcon />}
                    onClick={handleOpenCreateDialog}
                    sx={{ bgcolor: "#6366f1" }}
                  >
                    Add First Waypoint
                  </Button>
                </Stack>
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

      {/* Standard Trip Stop Dialog */}
      <TripStopDialog
        open={isCreateDialogOpen}
        tripId={tripId}
        mode="create"
        defaultValues={{
          name: "",
          placeId: null,
          formattedAddress: "",
          latitude: null,
          longitude: null,
          category: TripStopCategory.Destination,
          arrivalDate: "",
          departureDate: "",
          notes: "",
        }}
        onClose={() => setIsCreateDialogOpen(false)}
        onRedirectToAccommodation={handleRedirectToAccommodation}
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
          }}
          onClose={() => setSelectedStop(null)}
          onRedirectToAccommodation={handleRedirectToAccommodation}
        />
      )}

      {/* Canonical Accommodation Editor Dialog */}
      <AccommodationDialog
        open={isAccommodationDialogOpen}
        onClose={() => {
          setIsAccommodationDialogOpen(false);
          setEditingAccommodation(null);
        }}
        onSubmit={handleAccommodationSubmit}
        editingAccommodation={editingAccommodation}
        isLoading={
          createAccommodationMutation.isPending || updateAccommodationMutation.isPending
        }
      />

      {/* Delete Confirmation Dialog */}
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
