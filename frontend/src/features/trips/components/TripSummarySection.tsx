import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

import { formatDate } from "@/shared/utils/date";

import type { Trip } from "../types/trip";

type TripSummarySectionProps = {
  trip: Trip;
};

type SummaryItemProps = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
};

function SummaryItem({ icon, label, value }: SummaryItemProps) {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
      <Box
        sx={{
          color: "action.active",
          display: "flex",
          mt: 0.25,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{
            display: "block",
            lineHeight: 1,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontWeight: 500,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function TripSummarySection({ trip }: TripSummarySectionProps) {
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);

  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          <SummaryItem
            icon={<CalendarMonthIcon color="action" />}
            label="Dates"
            value={`${formatDate(trip.startDate)} – ${formatDate(trip.endDate)}`}
          />

          <SummaryItem
            icon={<AccessTimeIcon color="action" />}
            label="Duration"
            value={`${duration} Days`}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
