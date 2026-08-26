import BedtimeIcon from "@mui/icons-material/Bedtime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotesIcon from "@mui/icons-material/Notes";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
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
import { forwardRef, useState } from "react";

import { formatDate } from "@/shared/utils/date";

import type { TripStop } from "../types/tripStop";
import { getStayDurationInfo } from "../utils/stayDurationUtils";
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

const TripStopCard = forwardRef<HTMLDivElement, TripStopCardProps>(
  ({ stop, onEdit, onDelete, dragHandleProps, selected = false, onStopSelect }, ref) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const menuId = `stop-menu-${stop.id}`;
    const buttonId = `stop-menu-button-${stop.id}`;

    const stayInfo = getStayDurationInfo(stop.arrivalDate, stop.departureDate);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    return (
      <Card
        ref={ref}
        component="article"
        aria-label={`Trip stop: ${stop.name}`}
        onClick={() => onStopSelect?.(stop.id)}
        className="neo-convex"
        sx={{
          borderRadius: 2.5,
          cursor: "pointer",
          borderLeft: "4px solid",
          borderLeftColor: selected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
          bgcolor: selected ? "#201f1f" : "#1a1a1e",
          border: "1px solid",
          borderColor: selected ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
          boxShadow: selected ? "0 0 16px rgba(99, 102, 241, 0.3)" : "none",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            borderColor: selected ? "#6366f1" : "rgba(99, 102, 241, 0.4)",
            transform: "translateY(-1px)",
          },
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, sm: 2.2 },
            "&:last-child": {
              pb: { xs: 2, sm: 2.2 },
            },
          }}
        >
          <Stack spacing={1.2}>
            {/* Category & Menu Header */}
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
                  flexWrap: "wrap",
                  gap: 0.5,
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
                      color: "#94a3b8",
                      "&:active": {
                        cursor: "grabbing",
                      },
                      p: 0.4,
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.06)",
                        color: "#ffffff",
                      },
                    }}
                    aria-label={`Reorder ${stop.name}. Press Space or Enter to drag.`}
                  >
                    <DragIndicatorIcon sx={{ fontSize: 18 }} />
                  </Box>
                )}

                <TripStopCategoryChip category={stop.category} />

                {stayInfo.isOvernight ? (
                  <Chip
                    icon={<BedtimeIcon sx={{ fontSize: "0.8rem !important", color: "#818cf8 !important" }} />}
                    label={stayInfo.label}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      bgcolor: "rgba(99, 102, 241, 0.15)",
                      color: "#818cf8",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  />
                ) : (
                  <Chip
                    icon={<WbSunnyIcon sx={{ fontSize: "0.8rem !important", color: "#fbbf24 !important" }} />}
                    label={stayInfo.label}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      bgcolor: "rgba(251, 191, 36, 0.12)",
                      color: "#fbbf24",
                      border: "1px solid rgba(251, 191, 36, 0.3)",
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  />
                )}
              </Stack>

              <IconButton
                id={buttonId}
                size="small"
                onClick={handleMenuOpen}
                aria-label={`Waypoint actions for ${stop.name}`}
                aria-controls={open ? menuId : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                sx={{
                  color: "#94a3b8",
                  "&:hover": { color: "#ffffff", bgcolor: "rgba(255, 255, 255, 0.06)" },
                }}
              >
                <MoreVertIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>

            {/* Stop Title & Location */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 800,
                  color: "#f8fafc",
                  lineHeight: 1.25,
                }}
              >
                {stop.name}
              </Typography>

              {stop.formattedAddress && (
                <Typography variant="caption" sx={{ color: "#94a3b8", mt: 0.3, display: "block" }}>
                  {stop.formattedAddress}
                </Typography>
              )}
            </Box>

            {/* Arrival & Departure Times Bar */}
            <Box
              className="neo-inset"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
                p: 1.2,
                borderRadius: 1.5,
                bgcolor: "#141313",
                alignItems: "center",
              }}
            >
              {stop.arrivalDate && (
                <Stack direction="row" spacing={0.6} sx={{ alignItems: "center" }}>
                  <CalendarTodayIcon sx={{ fontSize: 13, color: "#818cf8" }} />
                  <Typography className="font-mono" sx={{ fontSize: "0.72rem", color: "#e4e4e7", fontWeight: 700 }}>
                    Arr: {formatDate(stop.arrivalDate)}
                  </Typography>
                </Stack>
              )}

              {stop.departureDate && (
                <Stack direction="row" spacing={0.6} sx={{ alignItems: "center" }}>
                  <CalendarTodayIcon sx={{ fontSize: 13, color: "#bef264" }} />
                  <Typography className="font-mono" sx={{ fontSize: "0.72rem", color: "#e4e4e7", fontWeight: 700 }}>
                    Dep: {formatDate(stop.departureDate)}
                  </Typography>
                </Stack>
              )}
            </Box>

            {/* Notes */}
            {stop.notes && (
              <Stack direction="row" spacing={0.8} sx={{ alignItems: "flex-start", mt: 0.5 }}>
                <NotesIcon sx={{ fontSize: 14, color: "#94a3b8", mt: 0.2 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: "#94a3b8",
                    fontStyle: "italic",
                    lineHeight: 1.4,
                  }}
                >
                  {stop.notes}
                </Typography>
              </Stack>
            )}
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
              onEdit(stop);
            }}
            sx={{ color: "#e2e8f0", "&:hover": { bgcolor: "rgba(255, 255, 255, 0.06)" } }}
          >
            <ListItemIcon sx={{ color: "#818cf8" }}>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Waypoint</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClose();
              onDelete(stop);
            }}
            sx={{ color: "#f87171", "&:hover": { bgcolor: "rgba(248, 113, 113, 0.08)" } }}
          >
            <ListItemIcon sx={{ color: "#f87171" }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete Waypoint</ListItemText>
          </MenuItem>
        </Menu>
      </Card>
    );
  }
);

TripStopCard.displayName = "TripStopCard";

export default TripStopCard;
