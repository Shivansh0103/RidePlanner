import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HotelIcon from "@mui/icons-material/Hotel";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import PhoneIcon from "@mui/icons-material/Phone";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import { useAccommodations } from "@/features/accommodations/hooks/useAccommodations";

interface OverviewAccommodationCardProps {
  tripId: string;
  onViewAccommodations?: () => void;
}

export default function OverviewAccommodationCard({
  tripId,
  onViewAccommodations,
}: OverviewAccommodationCardProps) {
  const { data: accommodations = [] } = useAccommodations(tripId);

  const nextStay = accommodations[0]; // First stay or upcoming stay

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: "primary.50",
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HotelIcon fontSize="small" />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Upcoming Accommodation
              </Typography>
            </Stack>

            {onViewAccommodations && (
              <Button
                size="small"
                variant="text"
                onClick={onViewAccommodations}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                View All ({accommodations.length})
              </Button>
            )}
          </Stack>

          {nextStay ? (
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {nextStay.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {nextStay.formattedAddress}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Chip
                  icon={<CalendarMonthIcon fontSize="small" />}
                  label={`${nextStay.checkInDate} → ${nextStay.checkOutDate}`}
                  size="small"
                  variant="outlined"
                />

                <Chip
                  icon={<NightsStayIcon fontSize="small" />}
                  label={`${nextStay.nights} ${
                    nextStay.nights === 1 ? "Night" : "Nights"
                  }`}
                  size="small"
                  color="primary"
                />
              </Stack>

              {nextStay.contactPhone && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<PhoneIcon fontSize="small" />}
                  href={`tel:${nextStay.contactPhone}`}
                  sx={{ alignSelf: "flex-start", borderRadius: 2 }}
                >
                  Call Property
                </Button>
              )}
            </Stack>
          ) : (
            <Box
              sx={{
                py: 2,
                px: 2,
                bgcolor: "action.hover",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No accommodation stays planned yet.
              </Typography>
              {onViewAccommodations && (
                <Button
                  size="small"
                  variant="contained"
                  onClick={onViewAccommodations}
                  sx={{ mt: 1, borderRadius: 2 }}
                >
                  Plan Accommodation
                </Button>
              )}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
