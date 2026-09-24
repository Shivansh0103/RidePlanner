import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import HotelIcon from "@mui/icons-material/Hotel";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import PaymentsIcon from "@mui/icons-material/Payments";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { toast } from "sonner";

import { formatCurrency, formatDate } from "@/shared/utils";

import { ACCOMMODATION_TYPE_OPTIONS } from "../constants/accommodationTypeOptions";
import type { Accommodation } from "../types/accommodation";

interface AccommodationDetailsDialogProps {
  open: boolean;
  accommodation: Accommodation | null;
  onClose: () => void;
  onEdit?: (accommodation: Accommodation) => void;
  onDelete?: (accommodation: Accommodation) => void;
}

export default function AccommodationDetailsDialog({
  open,
  accommodation,
  onClose,
  onEdit,
  onDelete,
}: AccommodationDetailsDialogProps) {
  if (!accommodation) return null;

  const typeOption =
    ACCOMMODATION_TYPE_OPTIONS.find((opt) => opt.value === accommodation.type) ??
    ACCOMMODATION_TYPE_OPTIONS[0];

  const IconComponent = typeOption.icon || HotelIcon;

  const handleCopyConfirmation = () => {
    if (accommodation.confirmationNumber) {
      navigator.clipboard.writeText(accommodation.confirmationNumber);
      toast.success(`Confirmation #${accommodation.confirmationNumber} copied to clipboard!`);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          className: "glass-panel neo-convex",
          sx: {
            borderRadius: 3,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 24px 48px rgba(0,0,0,0.8)"
                : "0 20px 40px rgba(0,0,0,0.12)",
            p: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.15)" : "rgba(79, 70, 229, 0.1)",
                color: "primary.main",
                border: "1px solid",
                borderColor: (theme) =>
                  theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.3)" : "rgba(79, 70, 229, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconComponent sx={{ fontSize: 22 }} />
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 800,
                  color: "text.primary",
                  fontSize: "1.15rem",
                  lineHeight: 1.2,
                }}
              >
                {accommodation.name}
              </Typography>
              <Chip
                label={typeOption.label}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.66rem",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "rgba(190, 242, 100, 0.1)" : "rgba(79, 70, 229, 0.08)",
                  color: (theme) => (theme.palette.mode === "dark" ? "#bef264" : "primary.main"),
                  border: "1px solid",
                  borderColor: (theme) =>
                    theme.palette.mode === "dark" ? "rgba(190, 242, 100, 0.3)" : "rgba(79, 70, 229, 0.2)",
                  fontFamily: '"JetBrains Mono", monospace',
                  height: 20,
                  mt: 0.5,
                }}
              />
            </Box>
          </Stack>

          <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 2.5, py: 1.5 }}>
        <Stack spacing={2.5}>
          {/* Location details */}
          {accommodation.formattedAddress && (
            <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
              <LocationOnIcon sx={{ fontSize: 16, color: "primary.main", mt: 0.2, flexShrink: 0 }} />
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.82rem", lineHeight: 1.4 }}>
                {accommodation.formattedAddress}
              </Typography>
            </Stack>
          )}

          {/* Schedule & Duration Grid */}
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 6 }}>
              <Paper
                className="neo-inset font-mono"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: (theme) => (theme.palette.mode === "dark" ? "#141313" : "#f8fafc"),
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", mb: 0.5 }}>
                  <CalendarMonthIcon sx={{ fontSize: 14, color: "primary.main" }} />
                  <Typography className="font-mono" sx={{ fontSize: "0.66rem", color: "text.secondary", textTransform: "uppercase" }}>
                    Check-in Date
                  </Typography>
                </Stack>
                <Typography className="font-mono" sx={{ fontSize: "0.85rem", fontWeight: 700, color: "text.primary" }}>
                  {formatDate(accommodation.checkInDate)}
                </Typography>
                {accommodation.checkInTime && (
                  <Typography className="font-mono" sx={{ fontSize: "0.7rem", color: "primary.main", mt: 0.3 }}>
                    Arrival: {accommodation.checkInTime}
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Paper
                className="neo-inset font-mono"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: (theme) => (theme.palette.mode === "dark" ? "#141313" : "#f8fafc"),
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", mb: 0.5 }}>
                  <CalendarMonthIcon sx={{ fontSize: 14, color: "primary.main" }} />
                  <Typography className="font-mono" sx={{ fontSize: "0.66rem", color: "text.secondary", textTransform: "uppercase" }}>
                    Check-out Date
                  </Typography>
                </Stack>
                <Typography className="font-mono" sx={{ fontSize: "0.85rem", fontWeight: 700, color: "text.primary" }}>
                  {formatDate(accommodation.checkOutDate)}
                </Typography>
                {accommodation.checkOutTime && (
                  <Typography className="font-mono" sx={{ fontSize: "0.7rem", color: "primary.main", mt: 0.3 }}>
                    Departure: {accommodation.checkOutTime}
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Paper
                className="neo-inset font-mono"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: (theme) => (theme.palette.mode === "dark" ? "#141313" : "#f8fafc"),
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", mb: 0.5 }}>
                  <NightsStayIcon sx={{ fontSize: 14, color: "#0284c7" }} />
                  <Typography className="font-mono" sx={{ fontSize: "0.66rem", color: "text.secondary", textTransform: "uppercase" }}>
                    Duration
                  </Typography>
                </Stack>
                <Typography className="font-mono" sx={{ fontSize: "0.85rem", fontWeight: 800, color: "#0284c7" }}>
                  {accommodation.nights} {accommodation.nights === 1 ? "Night" : "Nights"}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Paper
                className="neo-inset font-mono"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: (theme) => (theme.palette.mode === "dark" ? "#141313" : "#f8fafc"),
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", mb: 0.5 }}>
                  <PaymentsIcon
                    sx={{
                      fontSize: 14,
                      color: (theme) => (theme.palette.mode === "dark" ? "#bef264" : "#059669"),
                    }}
                  />
                  <Typography className="font-mono" sx={{ fontSize: "0.66rem", color: "text.secondary", textTransform: "uppercase" }}>
                    Lodging Cost
                  </Typography>
                </Stack>
                <Typography
                  className="font-mono"
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    color: (theme) => (theme.palette.mode === "dark" ? "#bef264" : "#059669"),
                  }}
                >
                  {accommodation.cost > 0 ? formatCurrency(accommodation.cost) : "Free / Included"}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Confirmation & Booking Reference */}
          {accommodation.confirmationNumber && (
            <Box
              onClick={handleCopyConfirmation}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.08)" : "rgba(79, 70, 229, 0.06)",
                borderRadius: 2,
                border: "1px dashed",
                borderColor: (theme) =>
                  theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.35)" : "rgba(79, 70, 229, 0.3)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.16)" : "rgba(79, 70, 229, 0.12)",
                  borderColor: "primary.main",
                },
              }}
            >
              <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
                <ConfirmationNumberIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Box>
                  <Typography className="font-mono" sx={{ fontSize: "0.64rem", color: "text.secondary", textTransform: "uppercase" }}>
                    Booking Confirmation #
                  </Typography>
                  <Typography className="font-mono" sx={{ fontSize: "0.88rem", fontWeight: 800, color: "text.primary" }}>
                    {accommodation.confirmationNumber}
                  </Typography>
                </Box>
              </Stack>
              <Tooltip title="Click to copy">
                <ContentCopyIcon sx={{ fontSize: 16, color: "primary.main" }} />
              </Tooltip>
            </Box>
          )}

          {/* Contact Information & External Links */}
          {(accommodation.contactName || accommodation.contactPhone || accommodation.website) && (
            <Stack spacing={1.2}>
              <Typography className="font-mono" sx={{ fontSize: "0.68rem", color: "text.secondary", textTransform: "uppercase", fontWeight: 700 }}>
                Contact & Property Info
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                {accommodation.contactName && (
                  <Chip
                    icon={<PersonIcon sx={{ fontSize: 13 }} />}
                    label={accommodation.contactName}
                    size="small"
                    sx={{
                      bgcolor: (theme) => (theme.palette.mode === "dark" ? "#27272a" : "#f1f5f9"),
                      color: "text.primary",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "0.72rem",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  />
                )}
                {accommodation.contactPhone && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<PhoneIcon sx={{ fontSize: 13 }} />}
                    href={`tel:${accommodation.contactPhone}`}
                    sx={{
                      fontSize: "0.72rem",
                      color: "primary.main",
                      borderColor: "divider",
                      fontFamily: '"JetBrains Mono", monospace',
                      textTransform: "none",
                      py: 0.4,
                      "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
                    }}
                  >
                    Call: {accommodation.contactPhone}
                  </Button>
                )}
                {accommodation.website && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<LanguageIcon sx={{ fontSize: 13 }} />}
                    href={accommodation.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      fontSize: "0.72rem",
                      color: (theme) => (theme.palette.mode === "dark" ? "#bef264" : "#059669"),
                      borderColor: "divider",
                      fontFamily: '"JetBrains Mono", monospace',
                      textTransform: "none",
                      py: 0.4,
                      "&:hover": {
                        borderColor: (theme) => (theme.palette.mode === "dark" ? "#bef264" : "#059669"),
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    Official Website ↗
                  </Button>
                )}
              </Stack>
            </Stack>
          )}

          {/* Booking Notes */}
          {accommodation.bookingNotes && (
            <Stack spacing={0.8}>
              <Typography className="font-mono" sx={{ fontSize: "0.68rem", color: "text.secondary", textTransform: "uppercase", fontWeight: 700 }}>
                Reservation Notes & Check-in Rules
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontStyle: "italic",
                  bgcolor: (theme) => (theme.palette.mode === "dark" ? "#141313" : "#f8fafc"),
                  color: "text.primary",
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  fontSize: "0.78rem",
                  lineHeight: 1.4,
                }}
              >
                “{accommodation.bookingNotes}”
              </Typography>
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <Divider sx={{ borderColor: "divider" }} />

      <DialogActions sx={{ px: 2.5, py: 1.5, justifyContent: "space-between" }}>
        <Stack direction="row" spacing={1}>
          {onDelete && (
            <Button
              size="small"
              startIcon={<DeleteIcon sx={{ fontSize: 15 }} />}
              onClick={() => {
                onClose();
                onDelete(accommodation);
              }}
              sx={{ color: "error.main", fontSize: "0.74rem", textTransform: "none" }}
            >
              Remove
            </Button>
          )}
        </Stack>

        <Stack direction="row" spacing={1.2}>
          {onEdit && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditIcon sx={{ fontSize: 15 }} />}
              onClick={() => {
                onClose();
                onEdit(accommodation);
              }}
              sx={{
                color: "primary.main",
                borderColor: "divider",
                fontSize: "0.74rem",
                textTransform: "none",
                fontWeight: 700,
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              Edit Details
            </Button>
          )}
          <Button
            size="small"
            variant="contained"
            onClick={onClose}
            sx={{
              bgcolor: (theme) => (theme.palette.mode === "dark" ? "#27272a" : "#e2e8f0"),
              color: "text.primary",
              fontSize: "0.74rem",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: (theme) => (theme.palette.mode === "dark" ? "#3f3f46" : "#cbd5e1") },
            }}
          >
            Done
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
