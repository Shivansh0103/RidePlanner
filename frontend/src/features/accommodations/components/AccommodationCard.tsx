import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import PhoneIcon from "@mui/icons-material/Phone";
import {
  Box,
  Button,
  Chip,
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

interface AccommodationCardProps {
  accommodation: Accommodation;
  onEdit: (accommodation: Accommodation) => void;
  onDelete: (accommodation: Accommodation) => void;
}

export default function AccommodationCard({
  accommodation,
  onEdit,
  onDelete,
}: AccommodationCardProps) {
  const typeOption = ACCOMMODATION_TYPE_OPTIONS.find(
    (opt) => opt.value === accommodation.type
  ) ?? ACCOMMODATION_TYPE_OPTIONS[0];

  const IconComponent = typeOption.icon;

  const handleCopyConfirmation = () => {
    if (accommodation.confirmationNumber) {
      navigator.clipboard.writeText(accommodation.confirmationNumber);
      toast.success("Confirmation number copied!");
    }
  };

  return (
    <Paper
      className="neo-convex"
      sx={{
        p: 2.8,
        borderRadius: 2.5,
        bgcolor: "#1a1a1e",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "#6366f1",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Stack spacing={2}>
        {/* Header: Title, Type Chip, Actions */}
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                bgcolor: "rgba(99, 102, 241, 0.12)",
                color: "#818cf8",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconComponent fontSize="small" />
            </Box>

            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#f8fafc", lineHeight: 1.2 }}>
                  {accommodation.name}
                </Typography>
                <Chip
                  label={typeOption.label}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.68rem",
                    bgcolor: "rgba(255, 255, 255, 0.06)",
                    color: "#bef264",
                    border: "1px solid rgba(190, 242, 100, 0.3)",
                    fontFamily: '"JetBrains Mono", monospace',
                    height: 20,
                  }}
                />
              </Stack>

              <Stack
                direction="row"
                spacing={0.5}
                sx={{ alignItems: "center", mt: 0.5 }}
              >
                <LocationOnIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  {accommodation.formattedAddress}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          {/* Action buttons */}
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit stay details">
              <IconButton size="small" onClick={() => onEdit(accommodation)} sx={{ color: "#94a3b8", "&:hover": { color: "#818cf8" } }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove stay">
              <IconButton
                size="small"
                onClick={() => onDelete(accommodation)}
                sx={{ color: "#94a3b8", "&:hover": { color: "#f87171" } }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Stay Dates, Nights Counter, Cost */}
        <Box
          className="neo-inset"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            p: 1.5,
            borderRadius: 2,
            gap: 1,
            bgcolor: "#141313",
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <CalendarMonthIcon sx={{ fontSize: 16, color: "#818cf8" }} />
            <Typography className="font-mono" sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#e4e4e7" }}>
              {formatDate(accommodation.checkInDate)} → {formatDate(accommodation.checkOutDate)}
            </Typography>
            {accommodation.checkInTime && (
              <Typography className="font-mono" sx={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                (In: {accommodation.checkInTime} / Out: {accommodation.checkOutTime || "--"})
              </Typography>
            )}
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Chip
              icon={<NightsStayIcon sx={{ fontSize: 13 }} />}
              label={`${accommodation.nights} ${
                accommodation.nights === 1 ? "Night" : "Nights"
              }`}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: "0.68rem",
                bgcolor: "rgba(99, 102, 241, 0.15)",
                color: "#818cf8",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                fontFamily: '"JetBrains Mono", monospace',
              }}
            />

            {accommodation.cost > 0 && (
              <Chip
                label={formatCurrency(accommodation.cost)}
                size="small"
                sx={{
                  fontWeight: 800,
                  fontSize: "0.72rem",
                  bgcolor: "rgba(190, 242, 100, 0.12)",
                  color: "#bef264",
                  border: "1px solid rgba(190, 242, 100, 0.35)",
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              />
            )}
          </Stack>
        </Box>

        {/* Contact & Confirmation Quick Bar */}
        {(accommodation.confirmationNumber ||
          accommodation.contactPhone ||
          accommodation.website ||
          accommodation.contactName) && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {accommodation.confirmationNumber && (
              <Chip
                icon={<ConfirmationNumberIcon sx={{ fontSize: 13 }} />}
                label={`Conf: ${accommodation.confirmationNumber}`}
                size="small"
                onClick={handleCopyConfirmation}
                clickable
                sx={{
                  bgcolor: "#27272a",
                  color: "#e4e4e7",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.68rem",
                  fontWeight: 700,
                }}
              />
            )}

            {accommodation.contactPhone && (
              <Button
                size="small"
                variant="text"
                startIcon={<PhoneIcon sx={{ fontSize: 13 }} />}
                href={`tel:${accommodation.contactPhone}`}
                sx={{
                  color: "#818cf8",
                  fontSize: "0.72rem",
                  fontFamily: '"JetBrains Mono", monospace',
                  textTransform: "none",
                  py: 0,
                }}
              >
                {accommodation.contactPhone}
              </Button>
            )}

            {accommodation.website && (
              <Button
                size="small"
                variant="text"
                startIcon={<LanguageIcon sx={{ fontSize: 13 }} />}
                href={accommodation.website}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#bef264",
                  fontSize: "0.72rem",
                  fontFamily: '"JetBrains Mono", monospace',
                  textTransform: "none",
                  py: 0,
                }}
              >
                Website
              </Button>
            )}
          </Box>
        )}

        {/* Booking Notes */}
        {accommodation.bookingNotes && (
          <Typography
            variant="body2"
            sx={{
              fontStyle: "italic",
              bgcolor: "rgba(255, 255, 255, 0.02)",
              color: "#94a3b8",
              p: 1.2,
              borderRadius: 1.5,
              border: "1px solid rgba(255, 255, 255, 0.04)",
              fontSize: "0.8rem",
            }}
          >
            “{accommodation.bookingNotes}”
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
