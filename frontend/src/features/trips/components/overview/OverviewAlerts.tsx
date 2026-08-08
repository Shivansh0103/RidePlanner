import { Alert, AlertTitle, Stack } from "@mui/material";

import type { OverviewAlert } from "@/features/trips/utils/tripOverviewSelectors";

interface OverviewAlertsProps {
  alerts: OverviewAlert[];
}

export default function OverviewAlerts({ alerts }: OverviewAlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <Stack spacing={1.5}>
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          severity={alert.severity}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          <AlertTitle sx={{ fontWeight: 700 }}>{alert.title}</AlertTitle>
          {alert.message}
        </Alert>
      ))}
    </Stack>
  );
}
