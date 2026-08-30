import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import { formatCurrency, formatDate } from "@/shared/utils";

import { ACCOMMODATION_TYPE_OPTIONS } from "../constants/accommodationTypeOptions";
import type { Accommodation } from "../types/accommodation";

interface AccommodationCardProps {
  accommodation: Accommodation;
  onEdit: (accommodation: Accommodation) => void;
  onDelete: (accommodation: Accommodation) => void;
  onViewDetails: (accommodation: Accommodation) => void;
}

export default function AccommodationCard({
  accommodation,
  onEdit,
  onDelete,
  onViewDetails,
}: AccommodationCardProps) {
  const typeOption =
    ACCOMMODATION_TYPE_OPTIONS.find((opt) => opt.value === accommodation.type) ??
    ACCOMMODATION_TYPE_OPTIONS[0];

  const IconComponent = typeOption.icon;

  return (
    <Card
      className="neo-convex"
      onClick={() => onViewDetails(accommodation)}
      sx={{
        borderRadius: 2.5,
        bgcolor: "#1a1a1e",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        "&:hover": {
          borderColor: "rgba(129, 140, 248, 0.5)",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
          bgcolor: "#1f1f24",
          "& .view-action-text": {
            color: "#bef264",
          },
        },
      }}
    >
      <CardContent sx={{ p: 2, pb: 1.5, flex: 1, display: "flex", flexDirection: "column" }}>
        <Stack spacing={1.5} sx={{ flex: 1 }}>
          {/* Top Row: Type Icon + Name & Badge + Action Buttons */}
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
            <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", minWidth: 0, flex: 1 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: "rgba(99, 102, 241, 0.12)",
                  color: "#818cf8",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <IconComponent sx={{ fontSize: 18 }} />
              </Box>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 800,
                    color: "#f8fafc",
                    fontSize: "0.92rem",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {accommodation.name}
                </Typography>
                <Chip
                  label={typeOption.label}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.62rem",
                    bgcolor: "rgba(190, 242, 100, 0.08)",
                    color: "#bef264",
                    border: "1px solid rgba(190, 242, 100, 0.25)",
                    fontFamily: '"JetBrains Mono", monospace',
                    height: 18,
                    mt: 0.3,
                  }}
                />
              </Box>
            </Stack>

            {/* Edit / Delete actions */}
            <Stack
              direction="row"
              spacing={0.3}
              sx={{ flexShrink: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Tooltip title="Edit stay">
                <IconButton
                  size="small"
                  onClick={() => onEdit(accommodation)}
                  sx={{ color: "#94a3b8", p: 0.5, "&:hover": { color: "#818cf8", bgcolor: "rgba(99, 102, 241, 0.1)" } }}
                >
                  <EditIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Remove stay">
                <IconButton
                  size="small"
                  onClick={() => onDelete(accommodation)}
                  sx={{ color: "#94a3b8", p: 0.5, "&:hover": { color: "#f87171", bgcolor: "rgba(248, 113, 113, 0.1)" } }}
                >
                  <DeleteIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Location Address */}
          {accommodation.formattedAddress && (
            <Stack direction="row" spacing={0.6} sx={{ alignItems: "flex-start" }}>
              <LocationOnIcon sx={{ fontSize: 14, color: "#818cf8", mt: 0.2, flexShrink: 0 }} />
              <Typography
                variant="caption"
                sx={{
                  color: "#94a3b8",
                  fontSize: "0.72rem",
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {accommodation.formattedAddress}
              </Typography>
            </Stack>
          )}

          {/* Dates & Cost Telemetry Inset */}
          <Box
            className="neo-inset font-mono"
            sx={{
              p: 1.2,
              borderRadius: 2,
              bgcolor: "#141313",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
              <Stack direction="row" spacing={0.6} sx={{ alignItems: "center" }}>
                <CalendarMonthIcon sx={{ fontSize: 14, color: "#818cf8" }} />
                <Typography className="font-mono" sx={{ fontSize: "0.74rem", fontWeight: 700, color: "#e4e4e7" }}>
                  {formatDate(accommodation.checkInDate)} → {formatDate(accommodation.checkOutDate)}
                </Typography>
              </Stack>

              <Chip
                icon={<NightsStayIcon sx={{ fontSize: 12 }} />}
                label={`${accommodation.nights}N`}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.64rem",
                  bgcolor: "rgba(99, 102, 241, 0.15)",
                  color: "#818cf8",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  fontFamily: '"JetBrains Mono", monospace',
                  height: 20,
                }}
              />
            </Stack>

            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Typography className="font-mono" sx={{ fontSize: "0.66rem", color: "#71717a" }}>
                Estimated Cost
              </Typography>
              <Typography
                className="font-mono"
                sx={{
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  color: accommodation.cost > 0 ? "#bef264" : "#71717a",
                }}
              >
                {accommodation.cost > 0 ? formatCurrency(accommodation.cost) : "Free / Included"}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </CardContent>

      {/* Footer Quick Action Bar */}
      <Box
        sx={{
          py: 0.8,
          px: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          bgcolor: "rgba(0, 0, 0, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
          {accommodation.confirmationNumber && (
            <Chip
              icon={<ConfirmationNumberIcon sx={{ fontSize: 11 }} />}
              label="Confirmed"
              size="small"
              sx={{
                height: 18,
                fontSize: "0.6rem",
                bgcolor: "rgba(99, 102, 241, 0.12)",
                color: "#818cf8",
                border: "1px solid rgba(99, 102, 241, 0.25)",
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
              }}
            />
          )}
          {accommodation.bookingNotes && (
            <Typography className="font-mono" sx={{ fontSize: "0.62rem", color: "#71717a" }}>
              📝 Notes
            </Typography>
          )}
        </Stack>

        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          <Typography
            className="view-action-text font-mono"
            sx={{
              fontSize: "0.66rem",
              color: "#818cf8",
              fontWeight: 700,
              transition: "color 0.2s ease",
            }}
          >
            Details
          </Typography>
          <VisibilityOutlinedIcon sx={{ fontSize: 13, color: "#818cf8" }} />
        </Stack>
      </Box>
    </Card>
  );
}
