import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
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
          bg: "rgba(16, 185, 129, 0.12)",
          color: "#059669",
          border: "rgba(16, 185, 129, 0.3)",
          dot: "#10b981",
        };
      case "Planning":
        return {
          bg: "rgba(37, 99, 235, 0.1)",
          color: "#2563eb",
          border: "rgba(37, 99, 235, 0.25)",
          dot: "#3b82f6",
        };
      case "Completed":
        return {
          bg: "rgba(100, 116, 139, 0.1)",
          color: "#475569",
          border: "rgba(100, 116, 139, 0.2)",
          dot: "#64748b",
        };
      default:
        return {
          bg: "rgba(100, 116, 139, 0.1)",
          color: "#475569",
          border: "rgba(100, 116, 139, 0.2)",
          dot: "#64748b",
        };
    }
  };

  const statusStyle = getStatusStyles(trip.status);

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 12px 24px -4px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
          borderColor: "rgba(37, 99, 235, 0.3)",
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(`/trips/${trip.id}`)}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
          p: 3,
        }}
      >
        <CardContent sx={{ p: 0, width: "100%", flexGrow: 1 }}>
          <Stack spacing={2} sx={{ height: "100%" }}>
            {/* Header: Status Chip + Menu Button */}
            <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Chip
                icon={
                  <Box
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
                  letterSpacing: "0.02em",
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
                sx={{ color: "text.secondary" }}
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
                  fontWeight: 700,
                  color: "text.primary",
                  lineHeight: 1.3,
                  mb: 0.5,
                }}
              >
                {trip.name}
              </Typography>

              {trip.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
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

            {/* Footer Date Range & Arrow */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                mt: "auto",
                pt: 1.5,
                borderTop: "1px solid",
                borderColor: "rgba(15, 23, 42, 0.06)",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.6, fontWeight: 500 }}
              >
                <CalendarMonthIcon sx={{ fontSize: 16, color: "action.active" }} />
                {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
              </Typography>

              <Typography
                variant="caption"
                color="primary.main"
                sx={{ display: "flex", alignItems: "center", gap: 0.3, fontWeight: 700 }}
              >
                Cockpit
                <ArrowForwardIcon sx={{ fontSize: 14 }} />
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>

      <CardActions sx={{ display: "none" }}>
        {/* Hidden menu anchor */}
      </CardActions>

      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        slotProps={{
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
          onClick={() => {
            handleMenuClose();
            onEdit(trip);
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Details</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleMenuClose();
            onDelete(trip);
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon sx={{ color: "error.main" }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Trip</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
}
