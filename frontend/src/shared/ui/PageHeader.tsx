import { Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  action,
}: PageHeaderProps) {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="h4">
          {title}
        </Typography>

        {subtitle && (
          <Typography color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Stack>

      {action}
    </Stack>
  );
}