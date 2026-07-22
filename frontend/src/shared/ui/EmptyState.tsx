import { Stack, Typography } from "@mui/material";

type EmptyStateProps = {
  title: string;
  description?: string;
};

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <Stack
      spacing={1}
      sx={{
        alignItems: "center",
        py: 8,
      }}
    >
      <Typography variant="h6">
        {title}
      </Typography>

      {description && (
        <Typography
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          {description}
        </Typography>
      )}
    </Stack>
  );
}