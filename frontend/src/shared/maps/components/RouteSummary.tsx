import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PlaceIcon from "@mui/icons-material/Place";
import { Avatar, Card, CardContent, Grid, Stack, Typography } from "@mui/material";

import { formatDistance, formatDuration } from "@/shared/utils/formatters";

import type { RouteSummary as RouteSummaryType } from "../types/route";

export interface RouteSummaryProps {
  summary?: RouteSummaryType | null;
  stopCount: number;
}

export default function RouteSummary({ summary, stopCount }: RouteSummaryProps) {
  if (!summary || stopCount < 2) {
    return null;
  }

  const items = [
    {
      title: "Total Distance",
      value: formatDistance(summary.distanceMeters),
      icon: <DirectionsCarIcon />,
      iconBgColor: "primary.50",
      iconColor: "primary.main",
    },
    {
      title: "Drive Time",
      value: formatDuration(summary.durationMillis),
      icon: <AccessTimeIcon />,
      iconBgColor: "info.50",
      iconColor: "info.main",
    },
    {
      title: "Stops",
      value: `${stopCount} ${stopCount === 1 ? "Stop" : "Stops"}`,
      icon: <PlaceIcon />,
      iconBgColor: "success.50",
      iconColor: "success.main",
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mt: 2, mb: 1 }}>
      {items.map((item) => (
        <Grid key={item.title} size={{ xs: 12, sm: 4 }}>
          <Card
            elevation={1}
            sx={{
              height: "100%",
              borderRadius: 3,
              transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 3,
              },
            }}
          >
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: item.iconBgColor,
                    color: item.iconColor,
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                  }}
                >
                  {item.icon}
                </Avatar>

                <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      lineHeight: 1.2,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {item.value}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
