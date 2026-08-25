import EditIcon from "@mui/icons-material/Edit";
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
import { useNavigate, useParams } from "react-router-dom";

import { BreadcrumbsBar } from "@/shared/components";
import { ErrorState, LoadingSpinner } from "@/shared/ui";

import TripForm from "../components/TripForm";
import { useTrip } from "../hooks/useTrip";
import { useUpdateTrip } from "../hooks/useUpdateTrip";
import type { CreateTripRequest } from "../schemas/createTripSchema";

export default function EditTripPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const { data: trip, isLoading, isError } = useTrip(tripId ?? "");
  const { mutateAsync, isPending, error, isError: isUpdateError } = useUpdateTrip();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !trip) {
    return <ErrorState message="Unable to load trip expedition details for editing." />;
  }

  const handleUpdateTrip = async (data: CreateTripRequest) => {
    try {
      await mutateAsync({
        id: trip.id,
        ...data,
      });
      navigate(`/trips/${trip.id}`);
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
            { label: trip.name, to: `/trips/${trip.id}` },
            { label: "Edit Expedition" },
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
                  bgcolor: "rgba(37, 99, 235, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "primary.main",
                }}
              >
                <EditIcon fontSize="medium" />
              </Box>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif' }}>
                  Edit Expedition Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update trip title, dates, or route description notes.
                </Typography>
              </Box>
            </Stack>

            {isUpdateError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error instanceof Error ? error.message : "Failed to update trip."}
              </Alert>
            )}

            <Card variant="outlined" sx={{ borderRadius: 2.5, bgcolor: "background.default" }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <TripForm
                  key={trip.id}
                  defaultValues={{
                    name: trip.name,
                    description: trip.description ?? "",
                    startDate: trip.startDate,
                    endDate: trip.endDate,
                  }}
                  onSubmit={handleUpdateTrip}
                />
              </CardContent>
            </Card>

            <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end", pt: 1 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/trips/${trip.id}`)}
                disabled={isPending}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                form="trip-form"
                disabled={isPending}
                sx={{ fontWeight: 700, px: 3, boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)" }}
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}