import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
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
import { useState } from "react";

import { formatDate } from "@/shared/utils/date";

import type { TripStop } from "../types/tripStop";
import TripStopCategoryChip from "./TripStopCategoryChip";

type TripStopCardProps = {
  stop: TripStop;
  index?: number;
  onEdit: (stop: TripStop) => void;
  onDelete: (stop: TripStop) => void;
  dragHandleProps?: Record<string, unknown>;

  selected?: boolean;
  onStopSelect?: (stopId: string) => void;
};

export default function TripStopCard({
  stop,
  onEdit,
  onDelete,
  dragHandleProps,
  selected = false,
  onStopSelect,
}: TripStopCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const menuId = `stop-menu-${stop.id}`;
  const buttonId = `stop-menu-button-${stop.id}`;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      component="article"
      aria-label={`Trip stop: ${stop.name}`}
      variant="outlined"
      onClick={() => onStopSelect?.(stop.id)}
      sx={{
        borderRadius: 2,
        cursor: "pointer",
        borderLeft: 4,
        borderLeftColor: selected ? "primary.main" : "transparent",
        bgcolor: selected ? "action.selected" : "background.paper",
        boxShadow: selected ? 4 : 0,
        transition: "all 0.2s ease-in-out",

        "&:hover": {
          boxShadow: selected ? 6 : 2,
          borderColor: "action.disabled",
        },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, sm: 2.5 },
          "&:last-child": {
            pb: { xs: 2, sm: 2.5 },
          },
        }}
      >
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
              }}
            >
              {dragHandleProps && (
                <Box
                  tabIndex={0}
                  role="button"
                  {...dragHandleProps}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "grab",
                    color: "action.active",
                    "&:active": {
                      cursor: "grabbing",
                    },
                    p: 0.5,
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    "&:focus-visible": {
                      outline: "2px solid",
                      outlineColor: "primary.main",
                      outlineOffset: "1px",
                    },
                  }}
                  aria-label={`Reorder ${stop.name}. Press Space or Enter to drag.`}
                >
                  <DragIndicatorIcon fontSize="small" />
                </Box>
              )}

              <TripStopCategoryChip category={stop.category} />
            </Stack>

            <IconButton
              id={buttonId}
              size="small"
              onClick={handleMenuOpen}
              aria-label={`Actions menu for ${stop.name}`}
              aria-controls={open ? menuId : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              sx={{
                "&:focus-visible": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                  outlineOffset: "1px",
                },
              }}
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
            component="h4"
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: "1.05rem",
                sm: "1.25rem",
              },
              wordBreak: "break-word",
            }}
          >
            {stop.name}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <CalendarTodayIcon fontSize="small" color="action" />

            <Typography
              variant="body2"
              color="text.secondary"
              aria-label={`From ${formatDate(stop.arrivalDate)} to ${formatDate(stop.departureDate)}`}
              sx={{
                wordBreak: "break-word",
              }}
            >
              {formatDate(stop.arrivalDate)}
              {" → "}
              {formatDate(stop.departureDate)}
            </Typography>
          </Stack>

          {stop.notes && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                wordBreak: "break-word",
              }}
            >
              {stop.notes}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
