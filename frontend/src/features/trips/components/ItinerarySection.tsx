import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import { Button, Card, CardContent, CardHeader, Divider, Stack, Typography } from "@mui/material";
import AltRouteIcon from "@mui/icons-material/AltRoute";

export default function ItinerarySection() {
  return (
    <Card>
      <CardHeader title="Itinerary" />

      <Divider />

      <CardContent>
        <Stack
          spacing={3}
          sx={{
            alignItems: "center",
            py: 4,
          }}
        >
          <AltRouteIcon
            sx={{
              fontSize: 56,
              color: "action.disabled",
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
            }}
          >
            No stops yet
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              textAlign: "center",
              maxWidth: 360,
            }}
          >
            Add your first stop to start planning your journey.
          </Typography>

          <Button variant="contained" startIcon={<AddLocationAltIcon />}>
            Add First Stop
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
