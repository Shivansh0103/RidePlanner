import HotelIcon from "@mui/icons-material/Hotel";
import HotelClassIcon from "@mui/icons-material/HotelClass";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import PaymentsIcon from "@mui/icons-material/Payments";
import PlusOneIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import ConfirmDialog from "@/shared/components/ConfirmDialog";
import EmptyState from "@/shared/ui/EmptyState";
import ErrorState from "@/shared/ui/ErrorState";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";

import { useAccommodations } from "../hooks/useAccommodations";
import { useCreateAccommodation } from "../hooks/useCreateAccommodation";
import { useDeleteAccommodation } from "../hooks/useDeleteAccommodation";
import { useUpdateAccommodation } from "../hooks/useUpdateAccommodation";
import type { Accommodation } from "../types/accommodation";
import type { AccommodationFormValues } from "../validation/accommodationSchema";
import AccommodationCard from "./AccommodationCard";
import AccommodationDialog from "./AccommodationDialog";

interface AccommodationsSectionProps {
  tripId: string;
}

export default function AccommodationsSection({
  tripId,
}: AccommodationsSectionProps) {
  const { data: accommodations = [], isLoading, isError } = useAccommodations(
    tripId
  );

  const createMutation = useCreateAccommodation(tripId);
  const updateMutation = useUpdateAccommodation(tripId);
  const deleteMutation = useDeleteAccommodation(tripId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccommodation, setEditingAccommodation] =
    useState<Accommodation | null>(null);

  const [deletingAccommodation, setDeletingAccommodation] =
    useState<Accommodation | null>(null);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState message="Failed to load accommodation stays." />;

  const totalStays = accommodations.length;
  const totalNights = accommodations.reduce((acc, cur) => acc + cur.nights, 0);
  const totalCost = accommodations.reduce((acc, cur) => acc + cur.cost, 0);

  const handleOpenAdd = () => {
    setEditingAccommodation(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (acc: Accommodation) => {
    setEditingAccommodation(acc);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (values: AccommodationFormValues) => {
    if (editingAccommodation) {
      await updateMutation.mutateAsync({
        id: editingAccommodation.id,
        payload: values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingAccommodation) {
      await deleteMutation.mutateAsync(deletingAccommodation.id);
      setDeletingAccommodation(null);
    }
  };

  return (
    <Stack spacing={3}>
      {/* Header & Metrics Summary */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            mb: 2.5,
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Accommodation & Stay Planning
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your hotel, hostel, campsite, and homestay reservations.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<PlusOneIcon />}
            onClick={handleOpenAdd}
            sx={{ borderRadius: 2 }}
          >
            Add Accommodation
          </Button>
        </Stack>

        {/* Quick Metrics Bar */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "action.hover" }}>
              <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <HotelIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Stays
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {totalStays}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "action.hover" }}>
              <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <NightsStayIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Nights
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {totalNights} {totalNights === 1 ? "Night" : "Nights"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: "action.hover" }}>
              <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <PaymentsIcon color="success" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Accommodation Budget
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      ₹{totalCost.toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Accommodations List or Empty State */}
      {accommodations.length === 0 ? (
        <EmptyState
          icon={<HotelClassIcon sx={{ fontSize: 48, color: "text.secondary" }} />}
          title="No Accommodation Stays Planned"
          description="Where will you be staying during your trip? Add hotels, hostels, campsites, or homestays to your itinerary."
          action={
            <Button
              variant="contained"
              startIcon={<PlusOneIcon />}
              onClick={handleOpenAdd}
            >
              Add Stay
            </Button>
          }
        />
      ) : (
        <Stack spacing={2}>
          {accommodations.map((acc) => (
            <AccommodationCard
              key={acc.id}
              accommodation={acc}
              onEdit={handleOpenEdit}
              onDelete={(item) => setDeletingAccommodation(item)}
            />
          ))}
        </Stack>
      )}

      {/* Create / Edit Dialog */}
      <AccommodationDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingAccommodation(null);
        }}
        onSubmit={handleFormSubmit}
        editingAccommodation={editingAccommodation}
        defaultDisplayOrder={accommodations.length + 1}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deletingAccommodation}
        title="Remove Accommodation Stay"
        message={`Are you sure you want to remove "${deletingAccommodation?.name}"? This will also remove the stop from your map itinerary and synchronized budget estimate.`}
        confirmText="Remove Stay"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingAccommodation(null)}
        loading={deleteMutation.isPending}
      />
    </Stack>
  );
}
