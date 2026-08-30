import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import FlagIcon from "@mui/icons-material/Flag";
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
  tripStartDate?: string;
  tripEndDate?: string;
};

export default function ItinerarySection({
  tripId,
  selectedStopId,
  onStopSelect,
  routeLegs: propsRouteLegs,
  tripStartDate,
  tripEndDate,
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

  const handleRedirectToAccommodation = (stopValues: TripStopFormValues) => {
    const formValues: AccommodationFormValues = {
      name: stopValues.name || "",
      type: "Hotel",
      placeId: stopValues.placeId || "",
      formattedAddress: stopValues.formattedAddress || "",
      latitude: stopValues.latitude ?? null,
      longitude: stopValues.longitude ?? null,
      checkInDate: stopValues.arrivalDate || tripStartDate || "",
      checkOutDate: stopValues.departureDate || tripStartDate || "",
      checkInTime: "",
      checkOutTime: "",
      cost: 0,
      bookingNotes: stopValues.notes || "",
      confirmationNumber: "",
      contactName: "",
      contactPhone: "",
      website: "",
    };

    setEditingAccommodation(formValues as unknown as Accommodation);
    setIsAccommodationDialogOpen(true);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorState message="Failed to load itinerary stops." />;
  }

  // Calculate default dates for new stop
  const lastStop = stops.length > 0 ? stops[stops.length - 1] : null;
  const initialStopCategory = stops.length === 0 ? TripStopCategory.Checkpoint : TripStopCategory.Checkpoint;
  const initialStopArrival = stops.length === 0 ? (tripStartDate || "") : (lastStop?.departureDate || tripStartDate || "");
  const initialStopDeparture = stops.length === 0 ? (tripStartDate || "") : (lastStop?.departureDate || tripStartDate || "");

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <Card
        className="neo-convex"
        sx={{
          borderRadius: 2.5,
          bgcolor: "#1a1a1e",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 2.5, pb: 1, flexShrink: 0 }}>
          <Stack spacing={1.5}>
            {/* Header: Title, Telemetry Count & Actions */}
            <Stack
              direction="row"
              spacing={1}
              sx={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}
            >
              <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: "rgba(99, 102, 241, 0.15)",
                    color: "#818cf8",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AltRouteIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#f8fafc", fontSize: "1rem" }}>
                    Expedition Route Itinerary
                  </Typography>
                  <Typography className="font-mono" sx={{ fontSize: "0.68rem", color: "#94a3b8" }}>
                    Drag cards to re-sequence waypoint flow
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Chip
                  label={`${stops.length} Stop${stops.length === 1 ? "" : "s"}`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(190, 242, 100, 0.12)",
                    color: "#bef264",
                    border: "1px solid rgba(190, 242, 100, 0.3)",
                    fontWeight: 700,
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.68rem",
                    height: 22,
                  }}
                />

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<HotelIcon sx={{ fontSize: 14 }} />}
                  onClick={() => handleOpenAccommodationDialog(null)}
                  sx={{
                    borderColor: "rgba(99, 102, 241, 0.4)",
                    color: "#818cf8",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    height: 28,
                    px: 1.2,
                    "&:hover": { borderColor: "#818cf8", bgcolor: "rgba(99, 102, 241, 0.08)" },
                  }}
                >
                  Add Stay
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddLocationAltIcon sx={{ fontSize: 14 }} />}
                  onClick={handleOpenCreateDialog}
                  className="glow-indigo"
                  sx={{
                    bgcolor: "#6366f1",
                    color: "#ffffff",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    height: 28,
                    px: 1.5,
                    "&:hover": { bgcolor: "#4f46e5" },
                  }}
                >
                  {stops.length === 0 ? "Add Origin" : "Add Stop"}
                </Button>
              </Stack>
            </Stack>

            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.06)" }} />
          </Stack>
        </CardContent>

        {/* Scrollable Waypoint List */}
        <CardContent
          sx={{
            p: 2,
            pt: 0,
            flex: 1,
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: 5 },
            "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
            "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(255, 255, 255, 0.12)", borderRadius: 3 },
          }}
        >
          {stops.length === 0 ? (
            <EmptyState
              title="No Waypoints Plotted"
              description="Establish your route by defining the origin start point, scenic passes, and destinations."
              action={
                <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<FlagIcon />}
                    onClick={handleOpenCreateDialog}
                    className="glow-indigo"
                    sx={{
                      bgcolor: "#6366f1",
                      color: "#ffffff",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "0.72rem",
                      fontWeight: 800,
                    }}
                  >
                    Add Expedition Start Point
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
        tripStartDate={tripStartDate}
        tripEndDate={tripEndDate}
        isFirstStop={stops.length === 0}
        defaultValues={{
          name: "",
          placeId: null,
          formattedAddress: "",
          latitude: null,
          longitude: null,
          category: initialStopCategory,
          arrivalDate: initialStopArrival,
          departureDate: initialStopDeparture,
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
          tripStartDate={tripStartDate}
          tripEndDate={tripEndDate}
          isFirstStop={stops[0]?.id === selectedStop.id}
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
        tripStartDate={tripStartDate}
        tripEndDate={tripEndDate}
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
        confirmText="Delete Stop"
        loading={deleteTripStopMutation.isPending}
        onClose={() => setStopToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
