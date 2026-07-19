import { Card, CardContent, Typography } from "@mui/material";

type StatCardProps = {
  label: string;
  value: number;
};

export default function StatCard({
  label,
  value,
}: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700 }}
        >
          {value}
        </Typography>

        <Typography
          color="text.secondary"
          variant="body2"
        >
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
}