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
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 3,
        borderColor: "divider",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          boxShadow: 2,
          borderColor: "primary.main",
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
                width: 44,
                height: 44,
                borderRadius: 2.5,
                bgcolor: "primary.50",
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconComponent fontSize="medium" />
            </Box>

            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {accommodation.name}
                </Typography>
                <Chip
                  label={typeOption.label}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                />
              </Stack>

              <Stack
                direction="row"
                spacing={0.5}
                sx={{ alignItems: "center", mt: 0.5 }}
              >
                <LocationOnIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {accommodation.formattedAddress}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          {/* Action buttons */}
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit stay details">
              <IconButton size="small" onClick={() => onEdit(accommodation)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove stay">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(accommodation)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Stay Dates, Nights Counter, Cost */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            bgcolor: "background.default",
            p: 1.5,
            borderRadius: 2,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <CalendarMonthIcon fontSize="small" color="primary" />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {accommodation.checkInDate} → {accommodation.checkOutDate}
            </Typography>
            {accommodation.checkInTime && (
              <Typography variant="caption" color="text.secondary">
                (In: {accommodation.checkInTime} / Out: {accommodation.checkOutTime || "--"})
              </Typography>
            )}
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Chip
              icon={<NightsStayIcon fontSize="small" />}
              label={`${accommodation.nights} ${
                accommodation.nights === 1 ? "Night" : "Nights"
              }`}
              size="small"
              color="primary"
              variant="filled"
              sx={{ fontWeight: 700 }}
            />

            {accommodation.cost > 0 && (
              <Chip
                label={`₹${accommodation.cost.toLocaleString()}`}
                size="small"
                color="success"
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
            )}
          </Stack>
        </Stack>

        {/* Contact & Confirmation Quick Bar */}
        {(accommodation.confirmationNumber ||
          accommodation.contactPhone ||
          accommodation.website ||
          accommodation.contactName) && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {accommodation.confirmationNumber && (
              <Chip
                icon={<ConfirmationNumberIcon fontSize="small" />}
                label={`Conf: ${accommodation.confirmationNumber}`}
                size="small"
                onClick={handleCopyConfirmation}
                clickable
                variant="outlined"
                color="secondary"
              />
            )}

            {accommodation.contactPhone && (
              <Button
                size="small"
                variant="text"
                startIcon={<PhoneIcon fontSize="small" />}
                href={`tel:${accommodation.contactPhone}`}
                sx={{ textTransform: "none", py: 0 }}
              >
                {accommodation.contactPhone}
              </Button>
            )}

            {accommodation.website && (
              <Button
                size="small"
                variant="text"
                startIcon={<LanguageIcon fontSize="small" />}
                href={accommodation.website}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textTransform: "none", py: 0 }}
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
            color="text.secondary"
            sx={{
              fontStyle: "italic",
              bgcolor: "action.hover",
              p: 1.25,
              borderRadius: 1.5,
            }}
          >
            “{accommodation.bookingNotes}”
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
