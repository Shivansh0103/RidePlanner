import AddIcon from "@mui/icons-material/Add";
import GridViewIcon from "@mui/icons-material/GridView";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import ViewListIcon from "@mui/icons-material/ViewList";
import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

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
type SortOption = "date-desc" | "date-asc" | "name-asc" | "duration-desc";

export default function TripsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get("status");

  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>(() => {
    if (statusParam === "Active" || statusParam === "Planning" || statusParam === "Completed") {
      return statusParam;
    }
    return "ALL";
  });

  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    return (localStorage.getItem("trips_view_mode") as "grid" | "list") || "grid";
  });

  useEffect(() => {
    if (statusParam === "Active" || statusParam === "Planning" || statusParam === "Completed") {
      setSelectedFilter(statusParam);
    } else if (!statusParam) {
      setSelectedFilter("ALL");
    }
  }, [statusParam]);

  const handleFilterChange = (filter: FilterStatus) => {
    setSelectedFilter(filter);
    if (filter === "ALL") {
      searchParams.delete("status");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ status: filter });
    }
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("trips_view_mode", mode);
  };

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

  // Filtered and Sorted trips
  const filteredTrips = trips.filter((trip) => {
    const matchesFilter = selectedFilter === "ALL" || trip.status === selectedFilter;
    const matchesSearch =
      debouncedSearch.trim() === "" ||
      trip.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (trip.description && trip.description.toLowerCase().includes(debouncedSearch.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const sortedAndFilteredTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === "date-desc") {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    }
    if (sortBy === "date-asc") {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }
    if (sortBy === "name-asc") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "duration-desc") {
      const durA = new Date(a.endDate).getTime() - new Date(a.startDate).getTime();
      const durB = new Date(b.endDate).getTime() - new Date(b.startDate).getTime();
      return durB - durA;
    }
    return 0;
  });

  const filterOptions: { label: string; value: FilterStatus; count: number }[] = [
    { label: "All", value: "ALL", count: trips.length },
    { label: "Active", value: "Active", count: activeTripsCount },
    { label: "Planning", value: "Planning", count: planningTripsCount },
    { label: "Completed", value: "Completed", count: completedTripsCount },
  ];

  return (
    <Container maxWidth="xl" sx={{ pb: 6 }} className="animate-fade-in">
      <Stack spacing={3}>
        {/* Tier 1: Page Header Section */}
        <Box sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", pb: 2.5 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }}
          >
            <Box>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 0.5 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 800,
                    color: "#f8fafc",
                    letterSpacing: "-0.03em",
                    fontSize: { xs: "1.8rem", sm: "2.3rem" },
                  }}
                >
                  My Expeditions
                </Typography>
                <Box
                  className="neo-inset font-mono"
                  sx={{
                    px: 1.5,
                    py: 0.3,
                    borderRadius: 1.5,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#94a3b8",
                  }}
                >
                  {trips.length} Total Journeys
                </Box>
              </Stack>

              <Typography variant="body2" sx={{ color: "#94a3b8", maxWidth: 650, lineHeight: 1.5, fontSize: "0.82rem" }}>
                A definitive archive of your terrestrial operations. Monitor active routes, refine planned
                trajectories, and review past performance data.
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={() => setCreateDialogOpen(true)}
              startIcon={<AddIcon />}
              className="glow-indigo"
              sx={{
                bgcolor: "#6366f1",
                color: "#ffffff",
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 800,
                fontSize: "0.74rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                px: 2.5,
                py: 1,
                whiteSpace: "nowrap",
                "&:hover": { bgcolor: "#4f46e5" },
              }}
            >
              Plan New Expedition
            </Button>
          </Stack>
        </Box>

        {/* Tier 2: Dynamic Toolbar (Filter Pills Left, Controls Right) */}
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", lg: "center" } }}
        >
          {/* Status Filter Pills */}
          <Stack direction="row" spacing={1.2} sx={{ overflowX: "auto", pb: { xs: 1, lg: 0 } }}>
            {filterOptions.map((opt) => {
              const selected = selectedFilter === opt.value;
              const isCompleted = opt.value === "Completed";
              const isActive = opt.value === "Active";

              const activeColor = isActive ? "#bef264" : isCompleted ? "#38bdf8" : "#818cf8";
              const activeBg = isActive ? "rgba(190, 242, 100, 0.15)" : isCompleted ? "rgba(56, 189, 248, 0.15)" : "rgba(99, 102, 241, 0.15)";
              const activeBorder = isActive ? "#bef264" : isCompleted ? "#38bdf8" : "#6366f1";

              return (
                <Button
                  key={opt.value}
                  onClick={() => handleFilterChange(opt.value)}
                  size="small"
                  sx={{
                    borderRadius: 9999,
                    px: 2,
                    py: 0.6,
                    bgcolor: selected ? activeBg : "#1a1a1e",
                    borderColor: selected ? activeBorder : "rgba(255, 255, 255, 0.08)",
                    border: "1px solid",
                    color: selected ? activeColor : "#94a3b8",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      bgcolor: selected ? activeBg : "#201f1f",
                      color: "#ffffff",
                    },
                  }}
                >
                  {opt.label} <Box component="span" sx={{ opacity: 0.7, ml: 0.8 }}>[{opt.count}]</Box>
                </Button>
              );
            })}
          </Stack>

          {/* Search, Dark Sort Dropdown & View Mode Toggle */}
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap" }}>
            {/* Search Input */}
            <TextField
              size="small"
              placeholder="Search expeditions..."
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
                width: { xs: "100%", sm: 200 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "#141313",
                  fontSize: "0.78rem",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.08)" },
                  "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                  "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                },
              }}
            />

            {/* Custom Neomorphic Dark Sort Dropdown */}
            <FormControl size="small" sx={{ minWidth: 165 }}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon sx={{ fontSize: 16, color: "#818cf8", mr: -0.5 }} />
                  </InputAdornment>
                }
                className="neo-inset"
                sx={{
                  height: 38,
                  bgcolor: "#141313",
                  color: "#e4e4e7",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.08)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#6366f1",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#94a3b8",
                  },
                }}
                MenuProps={{
                  slotProps: {
                    paper: {
                      className: "neo-convex",
                      sx: {
                        bgcolor: "#1e1e24",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: 2,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
                        mt: 0.8,
                      },
                    },
                  },
                }}
              >
                <MenuItem value="date-desc" sx={{ fontSize: "0.75rem", fontFamily: '"JetBrains Mono", monospace', color: "#f8fafc", "&.Mui-selected": { bgcolor: "rgba(99, 102, 241, 0.2)" } }}>
                  Date: Newest
                </MenuItem>
                <MenuItem value="date-asc" sx={{ fontSize: "0.75rem", fontFamily: '"JetBrains Mono", monospace', color: "#f8fafc", "&.Mui-selected": { bgcolor: "rgba(99, 102, 241, 0.2)" } }}>
                  Date: Oldest
                </MenuItem>
                <MenuItem value="name-asc" sx={{ fontSize: "0.75rem", fontFamily: '"JetBrains Mono", monospace', color: "#f8fafc", "&.Mui-selected": { bgcolor: "rgba(99, 102, 241, 0.2)" } }}>
                  Name: A – Z
                </MenuItem>
                <MenuItem value="duration-desc" sx={{ fontSize: "0.75rem", fontFamily: '"JetBrains Mono", monospace', color: "#f8fafc", "&.Mui-selected": { bgcolor: "rgba(99, 102, 241, 0.2)" } }}>
                  Duration: Longest
                </MenuItem>
              </Select>
            </FormControl>

            {/* View Mode Toggle */}
            <Box
              className="neo-inset"
              sx={{
                display: "flex",
                alignItems: "center",
                p: 0.3,
                borderRadius: 2,
                bgcolor: "#141313",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                height: 38,
                boxSizing: "border-box",
              }}
            >
              <Tooltip title="Grid View">
                <IconButton
                  size="small"
                  onClick={() => handleViewModeChange("grid")}
                  sx={{
                    p: 0.6,
                    borderRadius: 1.5,
                    bgcolor: viewMode === "grid" ? "rgba(99, 102, 241, 0.2)" : "transparent",
                    color: viewMode === "grid" ? "#818cf8" : "#71717a",
                    "&:hover": { color: "#ffffff" },
                  }}
                >
                  <GridViewIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Compact List View">
                <IconButton
                  size="small"
                  onClick={() => handleViewModeChange("list")}
                  sx={{
                    p: 0.6,
                    borderRadius: 1.5,
                    bgcolor: viewMode === "list" ? "rgba(99, 102, 241, 0.2)" : "transparent",
                    color: viewMode === "list" ? "#818cf8" : "#71717a",
                    "&:hover": { color: "#ffffff" },
                  }}
                >
                  <ViewListIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        </Stack>

        {/* Trips List / Grid or Empty State */}
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
                handleFilterChange("ALL");
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
          <TripList trips={sortedAndFilteredTrips} viewMode={viewMode} onEdit={handleEdit} onDelete={handleDelete} />
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
