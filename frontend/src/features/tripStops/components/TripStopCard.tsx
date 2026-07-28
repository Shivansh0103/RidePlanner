import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlaceIcon from "@mui/icons-material/Place";
import {
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

import { formatDate } from "@/shared/utils/date";

import type { TripStop } from "../types/tripStop";

type TripStopCardProps = {
  stop: TripStop;
  onEdit: (stop: TripStop) => void;
  onDelete: (stop: TripStop) => void;
};

export default function TripStopCard({ stop, onEdit, onDelete }: TripStopCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const menuId = `stop-menu-${stop.id}`;
  const buttonId = `stop-menu-button-${stop.id}`;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Chip
              icon={<PlaceIcon />}
              label={`Stop ${stop.displayOrder}`}
              size="small"
              color="primary"
              variant="outlined"
            />

            <IconButton
              id={buttonId}
              size="small"
              onClick={handleMenuOpen}
              aria-label={`Actions for ${stop.name}`}
              aria-controls={open ? menuId : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <MoreVertIcon />
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
                  onEdit(stop);
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
                  onDelete(stop);
                }}
                sx={{ color: "error.main" }}
              >
                <ListItemIcon sx={{ color: "error.main" }}>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>

                <ListItemText>Delete</ListItemText>
              </MenuItem>
            </Menu>
          </Stack>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            {stop.name}
          </Typography>

          <Stack direction="row" sx={{ alignItems: "center", spacing: 1, display: "flex" }}>
            <CalendarTodayIcon fontSize="small" color="action" />

            <Typography variant="body2" color="text.secondary">
              {formatDate(stop.arrivalDate)}
              {" → "}
              {formatDate(stop.departureDate)}
            </Typography>
          </Stack>

          {stop.notes && <Typography color="text.secondary">{stop.notes}</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
}
