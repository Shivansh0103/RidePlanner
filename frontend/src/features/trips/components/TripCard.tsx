import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NavigationIcon from "@mui/icons-material/Navigation";
import {
  Box,
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
          bg: "rgba(190, 242, 100, 0.12)",
          color: "#bef264",
          border: "rgba(190, 242, 100, 0.35)",
          dot: "#bef264",
          glow: "0 0 12px rgba(190, 242, 100, 0.2)",
        };
      case "Planning":
        return {
          bg: "rgba(99, 102, 241, 0.12)",
          color: "#818cf8",
          border: "rgba(99, 102, 241, 0.35)",
          dot: "#6366f1",
          glow: "0 0 12px rgba(99, 102, 241, 0.2)",
        };
      case "Completed":
        return {
          bg: "rgba(148, 163, 184, 0.1)",
          color: "#94a3b8",
          border: "rgba(148, 163, 184, 0.25)",
          dot: "#64748b",
          glow: "none",
        };
      default:
        return {
          bg: "rgba(148, 163, 184, 0.1)",
          color: "#94a3b8",
          border: "rgba(148, 163, 184, 0.25)",
          dot: "#64748b",
          glow: "none",
        };
    }
  };

  const statusStyle = getStatusStyles(trip.status);

  return (
    <Card
      variant="outlined"
      onClick={() => navigate(`/trips/${trip.id}`)}
      sx={{
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#1a1a1e",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 12px 28px -4px rgba(0, 0, 0, 0.7), 0 0 16px rgba(99, 102, 241, 0.15)",
          borderColor: trip.status === "Active" ? "rgba(190, 242, 100, 0.4)" : "rgba(99, 102, 241, 0.4)",
        },
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Stack spacing={2} sx={{ height: "100%", flexGrow: 1 }}>
          {/* Header: Status Chip + Menu Button */}
          <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
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
                fontWeight: 800,
                fontSize: "0.7rem",
                letterSpacing: "0.04em",
              }}
            />

            <IconButton
              id={buttonId}
              size="small"
              onClick={handleMenuOpen}
              aria-label={`Trip actions for ${trip.name}`}
              aria-controls={open ? menuId : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              sx={{
                color: "#94a3b8",
                "&:hover": { color: "#ffffff", bgcolor: "rgba(255, 255, 255, 0.06)" },
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Stack>

          {/* Trip Title & Description */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 800,
                color: "#f8fafc",
                lineHeight: 1.3,
                mb: 0.5,
              }}
            >
              {trip.name}
            </Typography>

            {trip.description && (
              <Typography
                variant="body2"
                sx={{
                  color: "#94a3b8",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebKitLineClamp: 2,
                  WebKitBoxOrient: "vertical",
                  lineHeight: 1.5,
                }}
              >
                {trip.description}
              </Typography>
            )}
          </Box>

          {/* Footer Date Range & Action */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              mt: "auto",
              pt: 1.8,
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <Typography
              variant="caption"
              sx={{ display: "flex", alignItems: "center", gap: 0.6, fontWeight: 600, color: "#94a3b8" }}
            >
              <CalendarMonthIcon sx={{ fontSize: 16, color: "#64748b" }} />
              {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.4,
                fontWeight: 800,
                color: "#818cf8",
                letterSpacing: "0.02em",
              }}
            >
              <NavigationIcon sx={{ fontSize: 13 }} />
              COCKPIT
              <ArrowForwardIcon sx={{ fontSize: 14 }} />
            </Typography>
          </Stack>
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
          <ListItemText>Edit Expedition</ListItemText>
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
