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

import { formatDate } from "@/shared/utils/date";

import type { Trip } from "../types/trip";

type TripCardProps = {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
};

const STATUS_COLOR_MAP = {
  Planning: "info",
  Active: "success",
  Completed: "secondary",
} as const;

export default function TripCard({ trip, onEdit, onDelete }: TripCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();

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
        display: "flex",
        flexDirection: "column",
        transition: "0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea onClick={() => navigate(`/trips/${trip.id}`)} sx={{ flexGrow: 1 }}>
        <CardContent
          sx={{
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <Box>
              <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    lineHeight: 1.3,
                  }}
                >
                  {trip.name}
                </Typography>
                <Chip
                  label={trip.status}
                  size="small"
                  color={STATUS_COLOR_MAP[trip.status] ?? "default"}
                  variant="outlined"
                  sx={{ fontWeight: 600, textTransform: "capitalize" }}
                />
              </Stack>


              {trip.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {trip.description}
                </Typography>
              )}
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
      </CardActionArea>

      <CardActions
        sx={{
          justifyContent: "flex-end",
          px: 2,
          pb: 2,
          pt: 0,
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
      </CardActions>
    </Card>
  );
}
