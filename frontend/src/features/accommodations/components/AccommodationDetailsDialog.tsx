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
            bgcolor: "#1a1a1e",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 24px 48px rgba(0,0,0,0.8)",
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
                bgcolor: "rgba(99, 102, 241, 0.15)",
                color: "#818cf8",
                border: "1px solid rgba(99, 102, 241, 0.3)",
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
                  color: "#f8fafc",
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
                  bgcolor: "rgba(190, 242, 100, 0.1)",
                  color: "#bef264",
                  border: "1px solid rgba(190, 242, 100, 0.3)",
                  fontFamily: '"JetBrains Mono", monospace',
                  height: 20,
                  mt: 0.5,
                }}
              />
            </Box>
          </Stack>

          <IconButton onClick={onClose} size="small" sx={{ color: "#94a3b8" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 2.5, py: 1.5 }}>
        <Stack spacing={2.5}>
          {/* Location details */}
          {accommodation.formattedAddress && (
            <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
              <LocationOnIcon sx={{ fontSize: 16, color: "#818cf8", mt: 0.2, flexShrink: 0 }} />
              <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "0.82rem", lineHeight: 1.4 }}>
                {accommodation.formattedAddress}
              </Typography>
            </Stack>
          )}

          {/* Schedule & Duration Grid */}
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 6 }}>
              <Paper
                className="neo-inset font-mono"
                sx={{ p: 1.5, borderRadius: 2, bgcolor: "#141313", border: "1px solid rgba(255, 255, 255, 0.05)" }}
              >
                <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", mb: 0.5 }}>
                  <CalendarMonthIcon sx={{ fontSize: 14, color: "#818cf8" }} />
                  <Typography className="font-mono" sx={{ fontSize: "0.66rem", color: "#94a3b8", textTransform: "uppercase" }}>
                    Check-in Date
                  </Typography>
                </Stack>
                <Typography className="font-mono" sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#f8fafc" }}>
                  {formatDate(accommodation.checkInDate)}
                </Typography>
                {accommodation.checkInTime && (
                  <Typography className="font-mono" sx={{ fontSize: "0.7rem", color: "#818cf8", mt: 0.3 }}>
                    Arrival: {accommodation.checkInTime}
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Paper
                className="neo-inset font-mono"
                sx={{ p: 1.5, borderRadius: 2, bgcolor: "#141313", border: "1px solid rgba(255, 255, 255, 0.05)" }}
              >
                <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", mb: 0.5 }}>
                  <CalendarMonthIcon sx={{ fontSize: 14, color: "#818cf8" }} />
                  <Typography className="font-mono" sx={{ fontSize: "0.66rem", color: "#94a3b8", textTransform: "uppercase" }}>
                    Check-out Date
                  </Typography>
                </Stack>
                <Typography className="font-mono" sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#f8fafc" }}>
                  {formatDate(accommodation.checkOutDate)}
                </Typography>
                {accommodation.checkOutTime && (
                  <Typography className="font-mono" sx={{ fontSize: "0.7rem", color: "#818cf8", mt: 0.3 }}>
                    Departure: {accommodation.checkOutTime}
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Paper
                className="neo-inset font-mono"
                sx={{ p: 1.5, borderRadius: 2, bgcolor: "#141313", border: "1px solid rgba(255, 255, 255, 0.05)" }}
              >
                <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", mb: 0.5 }}>
                  <NightsStayIcon sx={{ fontSize: 14, color: "#38bdf8" }} />
                  <Typography className="font-mono" sx={{ fontSize: "0.66rem", color: "#94a3b8", textTransform: "uppercase" }}>
                    Duration
                  </Typography>
                </Stack>
                <Typography className="font-mono" sx={{ fontSize: "0.85rem", fontWeight: 800, color: "#38bdf8" }}>
                  {accommodation.nights} {accommodation.nights === 1 ? "Night" : "Nights"}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Paper
                className="neo-inset font-mono"
                sx={{ p: 1.5, borderRadius: 2, bgcolor: "#141313", border: "1px solid rgba(255, 255, 255, 0.05)" }}
              >
                <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", mb: 0.5 }}>
                  <PaymentsIcon sx={{ fontSize: 14, color: "#bef264" }} />
                  <Typography className="font-mono" sx={{ fontSize: "0.66rem", color: "#94a3b8", textTransform: "uppercase" }}>
                    Lodging Cost
                  </Typography>
                </Stack>
                <Typography className="font-mono" sx={{ fontSize: "0.85rem", fontWeight: 800, color: "#bef264" }}>
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
                bgcolor: "rgba(99, 102, 241, 0.08)",
                borderRadius: 2,
                border: "1px dashed rgba(99, 102, 241, 0.35)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": { bgcolor: "rgba(99, 102, 241, 0.16)", borderColor: "#818cf8" },
              }}
            >
              <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
                <ConfirmationNumberIcon sx={{ fontSize: 18, color: "#818cf8" }} />
                <Box>
                  <Typography className="font-mono" sx={{ fontSize: "0.64rem", color: "#94a3b8", textTransform: "uppercase" }}>
                    Booking Confirmation #
                  </Typography>
                  <Typography className="font-mono" sx={{ fontSize: "0.88rem", fontWeight: 800, color: "#f8fafc" }}>
                    {accommodation.confirmationNumber}
                  </Typography>
                </Box>
              </Stack>
              <Tooltip title="Click to copy">
                <ContentCopyIcon sx={{ fontSize: 16, color: "#818cf8" }} />
              </Tooltip>
            </Box>
          )}

          {/* Contact Information & External Links */}
          {(accommodation.contactName || accommodation.contactPhone || accommodation.website) && (
            <Stack spacing={1.2}>
              <Typography className="font-mono" sx={{ fontSize: "0.68rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>
                Contact & Property Info
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                {accommodation.contactName && (
                  <Chip
                    icon={<PersonIcon sx={{ fontSize: 13 }} />}
                    label={accommodation.contactName}
                    size="small"
                    sx={{ bgcolor: "#27272a", color: "#e4e4e7", fontFamily: '"JetBrains Mono", monospace', fontSize: "0.72rem" }}
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
                      color: "#818cf8",
                      borderColor: "rgba(99, 102, 241, 0.3)",
                      fontFamily: '"JetBrains Mono", monospace',
                      textTransform: "none",
                      py: 0.4,
                      "&:hover": { borderColor: "#818cf8", bgcolor: "rgba(99, 102, 241, 0.1)" },
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
                      color: "#bef264",
                      borderColor: "rgba(190, 242, 100, 0.3)",
                      fontFamily: '"JetBrains Mono", monospace',
                      textTransform: "none",
                      py: 0.4,
                      "&:hover": { borderColor: "#bef264", bgcolor: "rgba(190, 242, 100, 0.1)" },
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
              <Typography className="font-mono" sx={{ fontSize: "0.68rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>
                Reservation Notes & Check-in Rules
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontStyle: "italic",
                  bgcolor: "#141313",
                  color: "#cbd5e1",
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid rgba(255, 255, 255, 0.06)",
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

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

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
              sx={{ color: "#f87171", fontSize: "0.74rem", textTransform: "none" }}
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
                color: "#818cf8",
                borderColor: "rgba(99, 102, 241, 0.3)",
                fontSize: "0.74rem",
                textTransform: "none",
                fontWeight: 700,
                "&:hover": { borderColor: "#818cf8" },
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
              bgcolor: "#27272a",
              color: "#f8fafc",
              fontSize: "0.74rem",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: "#3f3f46" },
            }}
          >
            Done
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
