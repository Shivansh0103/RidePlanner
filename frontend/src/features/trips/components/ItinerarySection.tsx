import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import HotelIcon from "@mui/icons-material/Hotel";
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

import AccommodationDialog from "@/features/accommodations/components/AccommodationDialog";
import { useAccommodations } from "@/features/accommodations/hooks/useAccommodations";
import { useCreateAccommodation } from "@/features/accommodations/hooks/useCreateAccommodation";
import { useUpdateAccommodation } from "@/features/accommodations/hooks/useUpdateAccommodation";
import type { Accommodation } from "@/features/accommodations/types/accommodation";
import type { AccommodationFormValues } from "@/features/accommodations/validation/accommodationSchema";

import TripStopDialog from "@/features/tripStops/components/TripStopDialog";
import TripStopsView from "@/features/tripStops/components/TripStopsView";
import { useDeleteTripStop } from "@/features/tripStops/hooks/useDeleteTripStop";
import { useReorderTripStops } from "@/features/tripStops/hooks/useReorderTripStops";
import { useTripStops } from "@/features/tripStops/hooks/useTripStops";
import type { TripStop } from "@/features/tripStops/types/tripStop";
import { TripStopCategory } from "@/features/tripStops/types/tripStopCategory";
import type { TripStopFormValues } from "@/features/tripStops/validation/tripStopSchema";
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
    // If stop is linked to an accommodation or is of category Hotel, use canonical AccommodationDialog
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
    <Stack direction="row" spacing={1}>
      <Button
        variant="outlined"
        startIcon={<HotelIcon />}
        onClick={() => handleOpenAccommodationDialog(null)}
        sx={{ fontWeight: 600 }}
      >
        Add Stay
      </Button>

      <Button
        variant="contained"
        startIcon={<AddLocationAltIcon />}
        onClick={handleOpenCreateDialog}
        aria-label="Add a new stop to itinerary"
        sx={{ fontWeight: 600 }}
      >
        Add Stop
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
          action={addStopButton}
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
              description="Add your first stop or accommodation stay to start planning your journey."
              action={
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<HotelIcon />}
                    onClick={() => handleOpenAccommodationDialog(null)}
                  >
                    Add Stay
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddLocationAltIcon />}
                    onClick={handleOpenCreateDialog}
                  >
                    Add First Stop
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
