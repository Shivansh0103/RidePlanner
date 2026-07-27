import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlaceIcon from "@mui/icons-material/Place";
import { Card, CardContent, Chip, IconButton, Stack, Typography } from "@mui/material";

import { formatDate } from "@/shared/utils/date";

import type { TripStop } from "../types/tripStop";

type TripStopCardProps = {
  stop: TripStop;
};

export default function TripStopCard({ stop }: TripStopCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Chip
              icon={<PlaceIcon />}
              label={`Stop ${stop.displayOrder}`}
              size="small"
              color="primary"
              variant="outlined"
            />

            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          </Stack>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            {stop.name}
          </Typography>

          <Stack direction="row" sx={{ alignItems: "center", spacing: 1, display: "flex" }}>
            <CalendarTodayIcon fontSize="small" color="action" />

            <Typography variant="body2" color="text.secondary">
              {formatDate(stop.arrivalDate)}
              {" → "}
              {formatDate(stop.departureDate)}
            </Typography>
          </Stack>

          {stop.notes && <Typography color="text.secondary">{stop.notes}</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
}
