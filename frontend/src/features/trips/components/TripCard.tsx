import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Card, CardContent, Stack, Typography } from "@mui/material";

import type { Trip } from "../types/trip";
import { formatDate } from "@/shared/utils/date";

type TripCardProps = {
  trip: Trip;
};

export default function TripCard({ trip }: TripCardProps) {
  return (
    <Card
  elevation={2}
  sx={{
    borderRadius: 3,
    height: "100%",
    transition: "0.2s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: 6,
    },
  }}
>
      <CardContent
        sx={{
          p: 3,
        }}
      >
        <Stack spacing={2}>
          <div>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {trip.name}
            </Typography>

            {trip.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {trip.description}
              </Typography>
            )}
          </div>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              color: "text.secondary",
            }}
          >
            <CalendarMonthIcon fontSize="small" />

            <Typography variant="body2">
              {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}