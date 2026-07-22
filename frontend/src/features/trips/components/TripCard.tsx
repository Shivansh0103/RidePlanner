import { useState } from "react";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";

import { formatDate } from "@/shared/utils/date";
import type { Trip } from "../types/trip";

type TripCardProps = {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
};

export default function TripCard({ trip, onEdit, onDelete }: TripCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const menuId = `trip-menu-${trip.id}`;
  const buttonId = `trip-menu-button-${trip.id}`;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 3,
        height: "100%",
        transition: "0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Stack spacing={2} sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                {trip.name}
              </Typography>

              {trip.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {trip.description}
                </Typography>
              )}
            </Box>

            <IconButton
              id={buttonId}
              size="small"
              onClick={handleMenuOpen}
              aria-label={`Trip actions for ${trip.name}`}
              aria-controls={open ? menuId : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              sx={{ color: "action.active", mt: -0.5, mr: -0.5 }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>

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
                <ListItemText>Edit</ListItemText>
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
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            </Menu>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              color: "text.secondary",
              mt: "auto",
              pt: 1,
            }}
          >
            <CalendarMonthIcon fontSize="small" sx={{ color: "action.active" }} />

            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
