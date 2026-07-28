import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export default function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: "center",
        py: 8,
      }}
    >
      {icon && <Box sx={{ color: "action.disabled" }}>{icon}</Box>}

      <Stack spacing={1} sx={{ alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 600, textAlign: "center" }}>
          {title}
        </Typography>

        {description && (
          <Typography
            color="text.secondary"
            sx={{ textAlign: "center", maxWidth: 360 }}
          >
            {description}
          </Typography>
        )}
      </Stack>

      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Stack>
  );
}