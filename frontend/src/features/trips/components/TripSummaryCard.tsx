import { Avatar, Card, CardContent, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export type TripSummaryCardProps = {
  title: string;
  value: number | string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
};

export default function TripSummaryCard({
  title,
  value,
  icon,
  iconBgColor = "primary.50",
  iconColor = "primary.main",
}: TripSummaryCardProps) {
  return (
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
              bgcolor: iconBgColor,
              color: iconColor,
              width: 48,
              height: 48,
              borderRadius: 2,
            }}
          >
            {icon}
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
              {title}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
