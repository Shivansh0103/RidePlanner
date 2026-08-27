import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RouteIcon from "@mui/icons-material/Route";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { formatDate } from "@/shared/utils";

import type { Trip } from "../types/trip";
import TripCard from "./TripCard";

type TripListProps = {
  trips: Trip[];
  viewMode?: "grid" | "list";
  onEdit: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
};

function TripListItemRow({
  trip,
  onEdit,
  onDelete,
}: {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
}) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return { bg: "rgba(190, 242, 100, 0.15)", text: "#bef264", border: "rgba(190, 242, 100, 0.4)" };
      case "Planning":
        return { bg: "rgba(99, 102, 241, 0.15)", text: "#818cf8", border: "rgba(99, 102, 241, 0.4)" };
      case "Completed":
        return { bg: "rgba(56, 189, 248, 0.15)", text: "#38bdf8", border: "rgba(56, 189, 248, 0.4)" };
      default:
        return { bg: "rgba(255, 255, 255, 0.05)", text: "#94a3b8", border: "rgba(255, 255, 255, 0.1)" };
    }
  };

  const statusColor = getStatusColor(trip.status);

  return (
    <Paper
      className="neo-inset"
      onClick={() => navigate(`/trips/${trip.id}`)}
      sx={{
        p: 2,
        borderRadius: 2.5,
        bgcolor: "#17171a",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: "#1f1f24",
          borderColor: trip.status === "Active" ? "#bef264" : "#6366f1",
          transform: "translateY(-1px)",
        },
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" } }}
      >
        {/* Left: Icon & Info */}
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", minWidth: 280 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: statusColor.bg,
              border: `1px solid ${statusColor.border}`,
              color: statusColor.text,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {trip.status === "Active" ? <TwoWheelerIcon sx={{ fontSize: 20 }} /> : <RouteIcon sx={{ fontSize: 20 }} />}
          </Box>

          <Box sx={{ overflow: "hidden" }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, color: "#f8fafc", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {trip.name}
            </Typography>
            {trip.description && (
              <Typography
                variant="caption"
                sx={{ color: "#94a3b8", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}
              >
                {trip.description}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Middle: Dates & Duration */}
        <Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <CalendarMonthIcon sx={{ fontSize: 15, color: "#818cf8" }} />
            <Typography className="font-mono" sx={{ color: "#e4e4e7", fontSize: "0.76rem", fontWeight: 600 }}>
              {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
            </Typography>
          </Box>

          <Chip
            label={`${diffDays} ${diffDays === 1 ? "Day" : "Days"}`}
            size="small"
            sx={{
              height: 22,
              fontSize: "0.68rem",
              fontWeight: 700,
              fontFamily: '"JetBrains Mono", monospace',
              bgcolor: "rgba(255, 255, 255, 0.05)",
              color: "#94a3b8",
            }}
          />

          <Chip
            label={trip.status.toUpperCase()}
            size="small"
            sx={{
              height: 22,
              fontSize: "0.65rem",
              fontWeight: 800,
              fontFamily: '"JetBrains Mono", monospace',
              bgcolor: statusColor.bg,
              color: statusColor.text,
              border: `1px solid ${statusColor.border}`,
            }}
          />
        </Stack>

        {/* Right: Actions */}
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Button
            size="small"
            variant="outlined"
            endIcon={<OpenInNewIcon sx={{ fontSize: 13 }} />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/trips/${trip.id}`);
            }}
            sx={{
              py: 0.5,
              px: 1.5,
              borderColor: "rgba(99, 102, 241, 0.4)",
              color: "#818cf8",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.7rem",
              fontWeight: 800,
              "&:hover": { bgcolor: "#6366f1", color: "#ffffff", borderColor: "#6366f1" },
            }}
          >
            Cockpit
          </Button>

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setAnchorEl(e.currentTarget);
            }}
            sx={{ color: "#94a3b8", "&:hover": { color: "#ffffff" } }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            slotProps={{
              paper: {
                sx: {
                  bgcolor: "#1e1e24",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                },
              },
            }}
          >
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                setAnchorEl(null);
                onEdit(trip);
              }}
              sx={{ color: "#e2e8f0" }}
            >
              <ListItemIcon sx={{ color: "#818cf8" }}>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                setAnchorEl(null);
                onDelete(trip);
              }}
              sx={{ color: "#f87171" }}
            >
              <ListItemIcon sx={{ color: "#f87171" }}>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function TripList({ trips, viewMode = "grid", onEdit, onDelete }: TripListProps) {
  if (viewMode === "list") {
    return (
      <Stack spacing={1.5}>
        {trips.map((trip) => (
          <TripListItemRow key={trip.id} trip={trip} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </Stack>
    );
  }

  return (
    <Grid container spacing={3}>
      {trips.map((trip) => (
        <Grid
          key={trip.id}
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <TripCard trip={trip} onEdit={onEdit} onDelete={onDelete} />
        </Grid>
      ))}
    </Grid>
  );
}
