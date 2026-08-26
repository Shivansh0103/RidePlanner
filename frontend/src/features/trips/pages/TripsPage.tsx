import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExploreIcon from "@mui/icons-material/Explore";
import SearchIcon from "@mui/icons-material/Search";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
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

  return (
    <Container maxWidth="xl" sx={{ pb: 6 }} className="animate-fade-in">
      <Stack spacing={3.5}>
        {/* Page Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }}
        >
          <Box>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: "#f8fafc" }}>
                My Expeditions
              </Typography>
              <Chip
                label="EXPLORER"
                size="small"
                sx={{
                  bgcolor: "rgba(99, 102, 241, 0.12)",
                  color: "#818cf8",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  fontWeight: 800,
                  fontSize: "0.65rem",
                  borderRadius: 1,
                }}
              />
            </Stack>
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              Comprehensive log of all active routes, planned itineraries, and past journeys.
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              fontWeight: 700,
              px: 3,
              py: 1.1,
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              boxShadow: "0 4px 16px rgba(99, 102, 241, 0.4)",
            }}
          >
            Plan New Ride
          </Button>
        </Stack>

        {/* Quick Stats Ribbon */}
        {trips.length > 0 && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  bgcolor: "#1a1a1e",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: "rgba(99, 102, 241, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#818cf8",
                    border: "1px solid rgba(99, 102, 241, 0.25)",
                  }}
                >
                  <ExploreIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="h6" className="font-mono" sx={{ fontWeight: 800, color: "#f8fafc", lineHeight: 1.1 }}>
                    {trips.length}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600 }}>
                    Total Trips
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  bgcolor: "#1a1a1e",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: "rgba(190, 242, 100, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#bef264",
                    border: "1px solid rgba(190, 242, 100, 0.3)",
                  }}
                >
                  <TwoWheelerIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="h6" className="font-mono" sx={{ fontWeight: 800, color: "#bef264", lineHeight: 1.1 }}>
                    {activeTripsCount}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600 }}>
                    Active Rides
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  bgcolor: "#1a1a1e",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: "rgba(251, 191, 36, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fbbf24",
                    border: "1px solid rgba(251, 191, 36, 0.3)",
                  }}
                >
                  <CalendarMonthIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="h6" className="font-mono" sx={{ fontWeight: 800, color: "#f8fafc", lineHeight: 1.1 }}>
                    {planningTripsCount}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600 }}>
                    In Planning
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  bgcolor: "#1a1a1e",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: "rgba(148, 163, 184, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8",
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                  }}
                >
                  <CheckCircleIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="h6" className="font-mono" sx={{ fontWeight: 800, color: "#f8fafc", lineHeight: 1.1 }}>
                    {completedTripsCount}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600 }}>
                    Completed
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Tactical Filter and Search Bar */}
        {trips.length > 0 && (
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              borderRadius: 2.5,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "center" },
              gap: 2,
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Status Filter Tabs */}
            <Tabs
              value={selectedFilter}
              onChange={(_, val) => setSelectedFilter(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 42,
                "& .MuiTab-root": {
                  minHeight: 42,
                  py: 0.5,
                  px: 1.8,
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: "#94a3b8",
                  "&.Mui-selected": {
                    color: "#f8fafc",
                    fontWeight: 700,
                  },
                },
              }}
            >
              <Tab
                label={
                  <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                    <span>All</span>
                    <Chip label={trips.length} size="small" sx={{ height: 18, fontSize: "0.7rem", fontWeight: 700 }} />
                  </Stack>
                }
                value="ALL"
              />
              <Tab
                label={
                  <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                    <span>Active</span>
                    <Chip
                      label={activeTripsCount}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        bgcolor: "rgba(190, 242, 100, 0.15)",
                        color: "#bef264",
                        border: "1px solid rgba(190, 242, 100, 0.3)",
                      }}
                    />
                  </Stack>
                }
                value="Active"
              />
              <Tab
                label={
                  <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                    <span>Planning</span>
                    <Chip
                      label={planningTripsCount}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        bgcolor: "rgba(99, 102, 241, 0.15)",
                        color: "#818cf8",
                        border: "1px solid rgba(99, 102, 241, 0.3)",
                      }}
                    />
                  </Stack>
                }
                value="Planning"
              />
              <Tab
                label={
                  <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                    <span>Completed</span>
                    <Chip label={completedTripsCount} size="small" sx={{ height: 18, fontSize: "0.7rem", fontWeight: 700 }} />
                  </Stack>
                }
                value="Completed"
              />
            </Tabs>

            {/* Search Box */}
            <TextField
              size="small"
              placeholder="Search expeditions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ minWidth: { xs: "100%", md: 280 } }}
            />
          </Paper>
        )}

        {/* Trips Grid or Empty State */}
        {trips.length === 0 ? (
          <EmptyState
            title="No expeditions yet"
            description="Create your first motorcycle ride to begin mapping routes, accommodations, and packing checklists."
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{ fontWeight: 700 }}
              >
                Create First Trip
              </Button>
            }
          />
        ) : filteredTrips.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 5, textAlign: "center", borderRadius: 3, bgcolor: "#1a1a1e" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#f8fafc", mb: 0.5 }}>
              No matching expeditions found
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8", mb: 2 }}>
              Try adjusting your search query or status filter.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("ALL");
              }}
            >
              Clear Filters
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
