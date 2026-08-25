import AddIcon from "@mui/icons-material/Add";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { BreadcrumbsBar } from "@/shared/components";

import TripForm from "../components/TripForm";
import { tripDefaults } from "../constants/tripDefaults";
import { useCreateTrip } from "../hooks/useCreateTrip";
import type { CreateTripRequest } from "../schemas/createTripSchema";

export default function CreateTripPage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending, error, isError } = useCreateTrip();

  const handleCreateTrip = async (data: CreateTripRequest) => {
    try {
      const createdTrip = await mutateAsync(data);
      if (createdTrip && createdTrip.id) {
        navigate(`/trips/${createdTrip.id}`);
      } else {
        navigate("/trips");
      }
    } catch {
      // Alert handles error
    }
  };

  return (
    <Container maxWidth="md" sx={{ pb: 6 }} className="animate-fade-in">
      <Stack spacing={3}>
        <BreadcrumbsBar
          items={[
            { label: "My Trips", to: "/trips" },
            { label: "Plan New Ride" },
          ]}
        />

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "rgba(15, 23, 42, 0.08)",
          }}
        >
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                }}
              >
                <TwoWheelerIcon sx={{ color: "#ffffff", fontSize: 26 }} />
              </Box>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif' }}>
                  Plan a New Expedition
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Set up your trip name, expedition dates, and itinerary overview.
                </Typography>
              </Box>
            </Stack>

            {isError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error instanceof Error ? error.message : "Failed to create trip expedition."}
              </Alert>
            )}

            <Card variant="outlined" sx={{ borderRadius: 2.5, bgcolor: "background.default" }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <TripForm defaultValues={tripDefaults} onSubmit={handleCreateTrip} />
              </CardContent>
            </Card>

            <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end", pt: 1 }}>
              <Button variant="outlined" onClick={() => navigate("/trips")} disabled={isPending}>
                Cancel
              </Button>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                form="trip-form"
                disabled={isPending}
                startIcon={<AddIcon />}
                sx={{ fontWeight: 700, px: 3, boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)" }}
              >
                {isPending ? "Creating..." : "Create Expedition"}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}