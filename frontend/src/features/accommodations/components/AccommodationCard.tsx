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
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-2px)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 8px 24px rgba(0, 0, 0, 0.4)"
              : "0 8px 24px rgba(0, 0, 0, 0.08)",
          bgcolor: (theme) => (theme.palette.mode === "dark" ? "#1f1f24" : "#f8fafc"),
          "& .view-action-text": {
            color: (theme) => (theme.palette.mode === "dark" ? "#bef264" : "primary.main"),
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
                  bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.12)" : "rgba(79, 70, 229, 0.08)"),
                  color: "primary.main",
                  border: "1px solid",
                  borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.3)" : "rgba(79, 70, 229, 0.2)"),
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
                    color: "text.primary",
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
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? "rgba(190, 242, 100, 0.08)" : "rgba(79, 70, 229, 0.08)",
                    color: (theme) => (theme.palette.mode === "dark" ? "#bef264" : "primary.main"),
                    border: "1px solid",
                    borderColor: (theme) =>
                      theme.palette.mode === "dark" ? "rgba(190, 242, 100, 0.25)" : "rgba(79, 70, 229, 0.2)",
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
                  sx={{ color: "text.secondary", p: 0.5, "&:hover": { color: "primary.main", bgcolor: "action.hover" } }}
                >
                  <EditIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Remove stay">
                <IconButton
                  size="small"
                  onClick={() => onDelete(accommodation)}
                  sx={{ color: "text.secondary", p: 0.5, "&:hover": { color: "error.main", bgcolor: "action.hover" } }}
                >
                  <DeleteIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Location Address */}
          {accommodation.formattedAddress && (
            <Stack direction="row" spacing={0.6} sx={{ alignItems: "flex-start" }}>
              <LocationOnIcon sx={{ fontSize: 14, color: "primary.main", mt: 0.2, flexShrink: 0 }} />
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
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
              bgcolor: (theme) => (theme.palette.mode === "dark" ? "#141313" : "#f8fafc"),
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
              <Stack direction="row" spacing={0.6} sx={{ alignItems: "center" }}>
                <CalendarMonthIcon sx={{ fontSize: 14, color: "primary.main" }} />
                <Typography className="font-mono" sx={{ fontSize: "0.74rem", fontWeight: 700, color: "text.primary" }}>
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
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.15)" : "rgba(79, 70, 229, 0.1)",
                  color: "primary.main",
                  border: "1px solid",
                  borderColor: (theme) =>
                    theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.3)" : "rgba(79, 70, 229, 0.25)",
                  fontFamily: '"JetBrains Mono", monospace',
                  height: 20,
                }}
              />
            </Stack>

            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
              <Typography className="font-mono" sx={{ fontSize: "0.66rem", color: "text.secondary" }}>
                Estimated Cost
              </Typography>
              <Typography
                className="font-mono"
                sx={{
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  color: (theme) =>
                    accommodation.cost > 0
                      ? theme.palette.mode === "dark"
                        ? "#bef264"
                        : "#059669"
                      : "text.secondary",
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
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.02)"),
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
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.12)" : "rgba(79, 70, 229, 0.08)",
                color: "primary.main",
                border: "1px solid",
                borderColor: (theme) =>
                  theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.25)" : "rgba(79, 70, 229, 0.2)",
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
              }}
            />
          )}
          {accommodation.bookingNotes && (
            <Typography className="font-mono" sx={{ fontSize: "0.62rem", color: "text.secondary" }}>
              📝 Notes
            </Typography>
          )}
        </Stack>

        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          <Typography
            className="view-action-text font-mono"
            sx={{
              fontSize: "0.66rem",
              color: "primary.main",
              fontWeight: 700,
              transition: "color 0.2s ease",
            }}
          >
            Details
          </Typography>
          <VisibilityOutlinedIcon sx={{ fontSize: 13, color: "primary.main" }} />
        </Stack>
      </Box>
    </Card>
  );
}
