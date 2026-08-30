import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GridViewIcon from "@mui/icons-material/GridView";
import HotelIcon from "@mui/icons-material/Hotel";
import HotelClassIcon from "@mui/icons-material/HotelClass";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import PaymentsIcon from "@mui/icons-material/Payments";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
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
import type { AccommodationFormValues } from "../schemas/accommodationSchema";
import type { Accommodation } from "../types/accommodation";
import AccommodationCard from "./AccommodationCard";
import AccommodationDetailsDialog from "./AccommodationDetailsDialog";
import AccommodationDialog from "./AccommodationDialog";

interface AccommodationsSectionProps {
  tripId: string;
  tripStartDate?: string;
  tripEndDate?: string;
}

export default function AccommodationsSection({
  tripId,
  tripStartDate,
  tripEndDate,
}: AccommodationsSectionProps) {
  const { data: accommodations = [], isLoading, isError } = useAccommodations(tripId);

  const createMutation = useCreateAccommodation(tripId);
  const updateMutation = useUpdateAccommodation(tripId);
  const deleteMutation = useDeleteAccommodation(tripId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  const [viewingAccommodation, setViewingAccommodation] = useState<Accommodation | null>(null);
  const [deletingAccommodation, setDeletingAccommodation] = useState<Accommodation | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
    const payload = {
      ...values,
      latitude: values.latitude ?? null,
      longitude: values.longitude ?? null,
    };
    if (editingAccommodation) {
      await updateMutation.mutateAsync({
        id: editingAccommodation.id,
        payload,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingAccommodation) {
      await deleteMutation.mutateAsync(deletingAccommodation.id);
      setDeletingAccommodation(null);
    }
  };

  return (
    <Stack spacing={2.5}>
      {/* 1. Header & Metrics HUD */}
      <Paper
        className="glass-panel neo-convex"
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 2.5,
          bgcolor: "#1a1a1e",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            mb: 2,
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <Box>
            <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", mb: 0.3 }}>
              <HotelIcon sx={{ color: "#bef264", fontSize: 22 }} />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 800,
                  color: "#f8fafc",
                  fontSize: { xs: "1.05rem", sm: "1.2rem" },
                }}
              >
                Accommodation & Stay Planning
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "0.8rem" }}>
              Track hotel reservations, campsites, homestays, check-in schedules, and room costs.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
            {/* View Mode Switcher */}
            {accommodations.length > 0 && (
              <Box
                className="neo-inset"
                sx={{
                  display: "inline-flex",
                  p: "3px",
                  borderRadius: 2,
                  bgcolor: "#141313",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={viewMode}
                  onChange={(_, val) => {
                    if (val) setViewMode(val);
                  }}
                  sx={{
                    gap: "3px",
                    "& .MuiToggleButtonGroup-grouped": {
                      border: "none !important",
                      borderRadius: "6px !important",
                      mx: 0,
                    },
                  }}
                >
                  <ToggleButton
                    value="grid"
                    sx={{
                      px: 1.2,
                      py: 0.4,
                      gap: 0.6,
                      color: "#94a3b8",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      textTransform: "none",
                      "&.Mui-selected": {
                        bgcolor: "#222228 !important",
                        color: "#bef264 !important",
                        border: "1px solid rgba(190, 242, 100, 0.35) !important",
                      },
                    }}
                  >
                    <GridViewIcon sx={{ fontSize: 14 }} />
                    Grid
                  </ToggleButton>

                  <ToggleButton
                    value="list"
                    sx={{
                      px: 1.2,
                      py: 0.4,
                      gap: 0.6,
                      color: "#94a3b8",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      textTransform: "none",
                      "&.Mui-selected": {
                        bgcolor: "#222228 !important",
                        color: "#bef264 !important",
                        border: "1px solid rgba(190, 242, 100, 0.35) !important",
                      },
                    }}
                  >
                    <FormatListBulletedIcon sx={{ fontSize: 14 }} />
                    List
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            )}

            <Button
              variant="contained"
              size="small"
              endIcon={<HotelIcon sx={{ fontSize: 15 }} />}
              onClick={handleOpenAdd}
              className="glow-acid"
              sx={{
                bgcolor: "#bef264",
                color: "#09090b",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.02em",
                px: 1.6,
                py: 0.65,
                borderRadius: 2,
                textTransform: "none",
                "&:hover": { bgcolor: "#a3e635" },
              }}
            >
              Add Stay
            </Button>
          </Stack>
        </Stack>

        {/* Quick Metrics Bar */}
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card
              className="neo-inset"
              sx={{
                borderRadius: 2,
                bgcolor: "#141313",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: 1.5,
                      bgcolor: "rgba(99, 102, 241, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#818cf8",
                    }}
                  >
                    <HotelIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Typography className="font-mono" sx={{ fontSize: "0.66rem", color: "#94a3b8", textTransform: "uppercase" }}>
                      Total Stays
                    </Typography>
                    <Typography className="font-mono" sx={{ fontSize: "1.05rem", fontWeight: 800, color: "#f8fafc" }}>
                      {totalStays} {totalStays === 1 ? "Stay" : "Stays"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Card
              className="neo-inset"
              sx={{
                borderRadius: 2,
                bgcolor: "#141313",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: 1.5,
                      bgcolor: "rgba(56, 189, 248, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#38bdf8",
                    }}
                  >
                    <NightsStayIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Typography className="font-mono" sx={{ fontSize: "0.66rem", color: "#94a3b8", textTransform: "uppercase" }}>
                      Total Duration
                    </Typography>
                    <Typography className="font-mono" sx={{ fontSize: "1.05rem", fontWeight: 800, color: "#f8fafc" }}>
                      {totalNights} {totalNights === 1 ? "Night" : "Nights"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Card
              className="neo-inset"
              sx={{
                borderRadius: 2,
                bgcolor: "#141313",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: 1.5,
                      bgcolor: "rgba(190, 242, 100, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#bef264",
                    }}
                  >
                    <PaymentsIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Box>
                    <Typography className="font-mono" sx={{ fontSize: "0.66rem", color: "#94a3b8", textTransform: "uppercase" }}>
                      Lodging Budget
                    </Typography>
                    <Typography className="font-mono" sx={{ fontSize: "1.05rem", fontWeight: 800, color: "#bef264" }}>
                      ₹{totalCost.toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* 2. Accommodations Grid or Empty State */}
      {accommodations.length === 0 ? (
        <EmptyState
          icon={<HotelClassIcon sx={{ fontSize: 48, color: "#818cf8" }} />}
          title="No Accommodation Stays Planned"
          description="Where will you be staying during your trip? Add hotels, hostels, campsites, or homestays to your itinerary."
          action={
            <Button
              variant="contained"
              endIcon={<HotelIcon sx={{ fontSize: 15 }} />}
              onClick={handleOpenAdd}
              sx={{ bgcolor: "#bef264", color: "#09090b", fontWeight: 800 }}
            >
              Add First Stay
            </Button>
          }
        />
      ) : (
        <Grid container spacing={2}>
          {accommodations.map((acc) => (
            <Grid
              key={acc.id}
              size={viewMode === "grid" ? { xs: 12, sm: 6, lg: 4 } : { xs: 12 }}
            >
              <AccommodationCard
                accommodation={acc}
                onEdit={handleOpenEdit}
                onDelete={(item) => setDeletingAccommodation(item)}
                onViewDetails={(item) => setViewingAccommodation(item)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* View Booking Dossier Details Dialog */}
      <AccommodationDetailsDialog
        open={!!viewingAccommodation}
        accommodation={viewingAccommodation}
        onClose={() => setViewingAccommodation(null)}
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeletingAccommodation(item)}
      />

      {/* Create / Edit Dialog */}
      <AccommodationDialog
        open={isDialogOpen}
        tripStartDate={tripStartDate}
        tripEndDate={tripEndDate}
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
