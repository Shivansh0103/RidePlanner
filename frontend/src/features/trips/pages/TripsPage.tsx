import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Container,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { useDebounce } from "@/shared/hooks";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import EmptyState from "@/shared/ui/EmptyState";
import ErrorState from "@/shared/ui/ErrorState";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";

import CreateTripDialog from "../components/CreateTripDialog";
import EditTripDialog from "../components/EditTripDialog";
import TripList from "../components/TripList";
import { useDeleteTrip } from "../hooks/useDeleteTrip";
import { useTrips } from "../hooks/useTrips";
import type { Trip } from "../types/trip";

type FilterStatus = "ALL" | "Active" | "Planning" | "Completed";

export default function TripsPage() {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>("ALL");

  const debouncedSearch = useDebounce(searchQuery, 250);
  const { data: trips = [], isLoading, isError, error } = useTrips();
  const deleteTripMutation = useDeleteTrip();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorState message={error instanceof Error ? error.message : "Unable to load trips"} />;
  }

  const handleEdit = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  const handleDelete = (trip: Trip) => {
    setTripToDelete(trip);
  };

  const handleCloseEdit = () => {
    setSelectedTrip(null);
  };

  const handleConfirmDelete = () => {
    if (!tripToDelete) return;

    deleteTripMutation.mutate(tripToDelete.id, {
      onSuccess: () => {
        setTripToDelete(null);
      },
    });
  };

  // Metric counts
  const activeTripsCount = trips.filter((t) => t.status === "Active").length;
  const planningTripsCount = trips.filter((t) => t.status === "Planning").length;
  const completedTripsCount = trips.filter((t) => t.status === "Completed").length;

  // Filtered trips
  const filteredTrips = trips.filter((trip) => {
    const matchesFilter = selectedFilter === "ALL" || trip.status === selectedFilter;
    const matchesSearch =
      debouncedSearch.trim() === "" ||
      trip.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (trip.description && trip.description.toLowerCase().includes(debouncedSearch.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const filterOptions: { label: string; value: FilterStatus; count: number }[] = [
    { label: "All", value: "ALL", count: trips.length },
    { label: "Active", value: "Active", count: activeTripsCount },
    { label: "Planning", value: "Planning", count: planningTripsCount },
    { label: "Completed", value: "Completed", count: completedTripsCount },
  ];

  return (
    <Container maxWidth="xl" sx={{ pb: 6 }} className="animate-fade-in">
      <Stack spacing={4}>
        {/* Stitch Header Section */}
        <Box sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", pb: 3 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "flex-end" } }}
          >
            {/* Title & Badge */}
            <Box>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 800,
                    color: "#f8fafc",
                    letterSpacing: "-0.03em",
                  }}
                >
                  My Expeditions
                </Typography>
                <Box
                  className="neo-inset font-mono"
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: 1.5,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#94a3b8",
                  }}
                >
                  {trips.length} Total Journeys
                </Box>
              </Stack>

              <Typography variant="body2" sx={{ color: "#94a3b8", maxWidth: 650, lineHeight: 1.6 }}>
                A definitive archive of your terrestrial operations. Monitor active routes, refine planned
                trajectories, and review past performance data.
              </Typography>
            </Box>

            {/* Search and Action CTA */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: { xs: "100%", md: "auto" } }}>
              <TextField
                size="small"
                placeholder="Search archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                      </InputAdornment>
                    ),
                  },
                }}
                className="neo-inset"
                sx={{
                  width: { xs: "100%", sm: 260 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#141313",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.08)" },
                    "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                    "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                  },
                }}
              />

              <Button
                variant="contained"
                onClick={() => setCreateDialogOpen(true)}
                startIcon={<AddIcon />}
                sx={{
                  background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  color: "#ffffff",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  px: 3,
                  py: 1.2,
                  boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)",
                  whiteSpace: "nowrap",
                }}
              >
                Plan New Expedition
              </Button>
            </Stack>
          </Stack>

          {/* Stitch Filter Pill Buttons */}
          <Stack direction="row" spacing={1.5} sx={{ mt: 3, overflowX: "auto", pb: 0.5 }}>
            {filterOptions.map((opt) => {
              const selected = selectedFilter === opt.value;
              return (
                <Button
                  key={opt.value}
                  onClick={() => setSelectedFilter(opt.value)}
                  size="small"
                  className={selected ? "glow-indigo" : ""}
                  sx={{
                    borderRadius: 9999,
                    px: 2.5,
                    py: 0.8,
                    bgcolor: selected ? "rgba(99, 102, 241, 0.15)" : "#1a1a1e",
                    borderColor: selected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
                    border: "1px solid",
                    color: selected ? "#818cf8" : "#94a3b8",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    "&:hover": {
                      bgcolor: selected ? "rgba(99, 102, 241, 0.25)" : "#201f1f",
                      color: "#ffffff",
                    },
                  }}
                >
                  {opt.label} <Box component="span" sx={{ opacity: 0.7, ml: 0.8 }}>[{opt.count}]</Box>
                </Button>
              );
            })}
          </Stack>
        </Box>

        {/* Trips Grid or Empty State */}
        {trips.length === 0 ? (
          <EmptyState
            title="No expeditions in archive"
            description="Initialize your journey ledger by creating your first motorcycle expedition route and itinerary."
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{
                  bgcolor: "#6366f1",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  letterSpacing: "0.06em",
                }}
              >
                Plan First Expedition
              </Button>
            }
          />
        ) : filteredTrips.length === 0 ? (
          <Paper className="neo-convex" sx={{ p: 6, textAlign: "center", borderRadius: 3, bgcolor: "#1a1a1e" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#f8fafc", mb: 0.5 }}>
              No matching expeditions found
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8", mb: 3 }}>
              Try adjusting your search filter criteria or search keyword.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("ALL");
              }}
              sx={{
                borderColor: "#6366f1",
                color: "#818cf8",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "0.72rem",
              }}
            >
              Reset Filters
            </Button>
          </Paper>
        ) : (
          <TripList trips={filteredTrips} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        {/* Dialogs */}
        <CreateTripDialog open={isCreateDialogOpen} onClose={() => setCreateDialogOpen(false)} />

        {selectedTrip && <EditTripDialog open trip={selectedTrip} onClose={handleCloseEdit} />}

        <ConfirmDialog
          open={tripToDelete !== null}
          title="Delete Trip Expedition"
          message={`Are you sure you want to permanently delete "${tripToDelete?.name}"? All associated itinerary stops, budget records, and checklists will be removed.`}
          confirmText="Delete Expedition"
          loading={deleteTripMutation.isPending}
          onClose={() => setTripToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      </Stack>
    </Container>
  );
}
