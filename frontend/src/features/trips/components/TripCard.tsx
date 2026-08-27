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
  Card,
  CardContent,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { formatDate } from "@/shared/utils";

import type { Trip } from "../types/trip";

type TripCardProps = {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
};

export default function TripCard({ trip, onEdit, onDelete }: TripCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const menuId = `trip-menu-${trip.id}`;
  const buttonId = `trip-menu-button-${trip.id}`;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Active":
        return {
          bg: "rgba(20, 19, 19, 0.85)",
          color: "#bef264",
          border: "rgba(190, 242, 100, 0.4)",
          dot: "#bef264",
          gradient: "radial-gradient(circle at 75% 25%, rgba(190, 242, 100, 0.2), transparent 60%), linear-gradient(180deg, rgba(20, 19, 19, 0.3) 0%, rgba(26, 26, 30, 0.98) 100%)",
        };
      case "Planning":
        return {
          bg: "rgba(20, 19, 19, 0.85)",
          color: "#818cf8",
          border: "rgba(99, 102, 241, 0.4)",
          dot: "#6366f1",
          gradient: "radial-gradient(circle at 75% 25%, rgba(99, 102, 241, 0.25), transparent 60%), linear-gradient(180deg, rgba(20, 19, 19, 0.3) 0%, rgba(26, 26, 30, 0.98) 100%)",
        };
      case "Completed":
        return {
          bg: "rgba(20, 19, 19, 0.85)",
          color: "#38bdf8",
          border: "rgba(56, 189, 248, 0.4)",
          dot: "#38bdf8",
          gradient: "radial-gradient(circle at 75% 25%, rgba(56, 189, 248, 0.22), transparent 60%), linear-gradient(180deg, rgba(20, 19, 19, 0.3) 0%, rgba(26, 26, 30, 0.98) 100%)",
        };
      default:
        return {
          bg: "rgba(20, 19, 19, 0.85)",
          color: "#94a3b8",
          border: "rgba(148, 163, 184, 0.3)",
          dot: "#64748b",
          gradient: "radial-gradient(circle at 75% 25%, rgba(148, 163, 184, 0.15), transparent 60%), linear-gradient(180deg, rgba(20, 19, 19, 0.3) 0%, rgba(26, 26, 30, 0.98) 100%)",
        };
    }
  };

  const statusStyle = getStatusStyles(trip.status);

  // Calculate duration in days
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  return (
    <Card
      className="neo-convex"
      onClick={() => navigate(`/trips/${trip.id}`)}
      sx={{
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#1a1a1e",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 16px 36px -4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(99, 102, 241, 0.2)",
          borderColor: trip.status === "Active" ? "rgba(190, 242, 100, 0.5)" : "rgba(99, 102, 241, 0.5)",
          "& .card-hover-overlay": {
            opacity: 1,
          },
        },
      }}
    >
      {/* Cinematic Topographical Contour Header */}
      <Box
        sx={{
          position: "relative",
          height: 160,
          width: "100%",
          bgcolor: "#141313",
          overflow: "hidden",
          backgroundImage: statusStyle.gradient,
        }}
      >
        {/* Subtle Decorative SVG Topo Contour Lines */}
        <Box
          component="svg"
          viewBox="0 0 400 160"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.18,
            pointerEvents: "none",
          }}
        >
          <path
            d="M-20,120 Q80,40 180,90 T380,60 T500,110"
            fill="none"
            stroke={statusStyle.dot}
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M-10,140 Q100,70 200,110 T400,80 T520,130"
            fill="none"
            stroke={statusStyle.dot}
            strokeWidth="1"
          />
          <circle cx="180" cy="90" r="4" fill={statusStyle.dot} />
          <circle cx="380" cy="60" r="4" fill={statusStyle.dot} />
        </Box>

        {/* Route Icon Badge (Bottom-Left of visual header) */}
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            left: 16,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: "rgba(20, 19, 19, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: statusStyle.color,
            }}
          >
            {trip.status === "Active" ? (
              <TwoWheelerIcon sx={{ fontSize: 18 }} />
            ) : (
              <RouteIcon sx={{ fontSize: 18 }} />
            )}
          </Box>
        </Box>

        {/* Status Pill Overlay (Top-Right) */}
        <Box
          sx={{
            position: "absolute",
            top: 14,
            right: 14,
            zIndex: 10,
          }}
        >
          <Chip
            icon={
              <Box
                className={trip.status === "Active" ? "pulse-telemetry" : undefined}
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: statusStyle.dot,
                  ml: "6px !important",
                }}
              />
            }
            label={trip.status.toUpperCase()}
            size="small"
            sx={{
              bgcolor: statusStyle.bg,
              color: statusStyle.color,
              border: `1px solid ${statusStyle.border}`,
              backdropFilter: "blur(8px)",
              fontWeight: 800,
              fontSize: "0.68rem",
              letterSpacing: "0.06em",
              fontFamily: '"JetBrains Mono", monospace',
              borderRadius: 1.5,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
            }}
          />
        </Box>

        {/* Context Menu Button (Top-Left) */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 10,
          }}
        >
          <IconButton
            id={buttonId}
            size="small"
            onClick={handleMenuOpen}
            aria-label={`Trip actions for ${trip.name}`}
            aria-controls={open ? menuId : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            sx={{
              bgcolor: "rgba(20, 19, 19, 0.7)",
              backdropFilter: "blur(6px)",
              color: "#94a3b8",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              "&:hover": { color: "#ffffff", bgcolor: "rgba(20, 19, 19, 0.9)" },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Hover Action Overlay */}
        <Box
          className="card-hover-overlay"
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(20, 19, 19, 0.75)",
            backdropFilter: "blur(4px)",
            opacity: 0,
            transition: "opacity 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            endIcon={<OpenInNewIcon fontSize="small" />}
            sx={{
              borderColor: "#6366f1",
              color: "#818cf8",
              bgcolor: "rgba(31, 31, 36, 0.8)",
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 800,
              fontSize: "0.74rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              boxShadow: "0 0 16px rgba(99, 102, 241, 0.4)",
              "&:hover": {
                bgcolor: "#6366f1",
                color: "#ffffff",
              },
            }}
          >
            Open Cockpit
          </Button>
        </Box>
      </Box>

      {/* Card Body */}
      <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Stack spacing={1.5} sx={{ height: "100%", flexGrow: 1 }}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 800,
                color: "#f8fafc",
                lineHeight: 1.2,
                mb: 0.5,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {trip.name}
            </Typography>

            <Typography
              className="font-mono"
              variant="caption"
              sx={{
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                gap: 0.8,
                fontSize: "0.7rem",
                fontWeight: 600,
              }}
            >
              <CalendarMonthIcon sx={{ fontSize: 13, color: "#64748b" }} />
              {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
            </Typography>
          </Box>

          {trip.description && (
            <Typography
              variant="body2"
              sx={{
                color: "#94a3b8",
                fontSize: "0.82rem",
                lineHeight: 1.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {trip.description}
            </Typography>
          )}

          {/* Bottom 2-Column Metrics Grid in Neomorphic Inset */}
          <Box
            className="neo-inset"
            sx={{
              mt: "auto",
              py: 1.2,
              px: 1.8,
              borderRadius: 2,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                className="font-mono"
                variant="caption"
                sx={{ color: "#94a3b8", opacity: 0.7, fontSize: "0.62rem", letterSpacing: "0.06em", textTransform: "uppercase", display: "block" }}
              >
                Duration
              </Typography>
              <Typography
                className="font-mono"
                sx={{ color: "#f8fafc", fontWeight: 800, fontSize: "0.88rem" }}
              >
                {diffDays} {diffDays === 1 ? "Day" : "Days"}
              </Typography>
            </Box>

            <Box sx={{ textAlign: "right" }}>
              <Typography
                className="font-mono"
                variant="caption"
                sx={{ color: "#94a3b8", opacity: 0.7, fontSize: "0.62rem", letterSpacing: "0.06em", textTransform: "uppercase", display: "block" }}
              >
                Telemetry
              </Typography>
              <Typography
                className="font-mono"
                sx={{ color: statusStyle.color, fontWeight: 800, fontSize: "0.88rem" }}
              >
                {trip.status === "Active" ? "LIVE" : trip.status === "Completed" ? "LOGGED" : "READY"}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>

      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#1e1e24",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.8)",
            },
          },
          list: {
            "aria-labelledby": buttonId,
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleMenuClose();
            onEdit(trip);
          }}
          sx={{ color: "#e2e8f0", "&:hover": { bgcolor: "rgba(255, 255, 255, 0.06)" } }}
        >
          <ListItemIcon sx={{ color: "#818cf8" }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Details</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleMenuClose();
            onDelete(trip);
          }}
          sx={{ color: "#f87171", "&:hover": { bgcolor: "rgba(248, 113, 113, 0.08)" } }}
        >
          <ListItemIcon sx={{ color: "#f87171" }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Expedition</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
}
