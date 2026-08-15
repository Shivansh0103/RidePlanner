import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import HotelIcon from "@mui/icons-material/Hotel";
import SpeedIcon from "@mui/icons-material/Speed";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

import ErrorState from "@/shared/ui/ErrorState";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";

import { useTripReadiness } from "../hooks/useTripReadiness";
import type { ReadinessItem } from "../types/readiness";

interface ReadinessSectionProps {
  tripId: string;
}

const CHECK_ICON_MAP: Record<string, React.ReactNode> = {
  Route: <AltRouteIcon color="primary" />,
  Checklist: <ChecklistRtlIcon color="primary" />,
  Documents: <FolderSpecialIcon color="primary" />,
  Contacts: <ContactPhoneIcon color="primary" />,
  Accommodations: <HotelIcon color="primary" />,
};

const CHECK_TAB_MAP: Record<string, string> = {
  Route: "itinerary",
  Checklist: "checklist",
  Documents: "documents",
  Contacts: "contacts",
  Accommodations: "accommodation",
};

export default function ReadinessSection({ tripId }: ReadinessSectionProps) {
  const { data: readiness, isLoading, isError } = useTripReadiness(tripId);
  const [, setSearchParams] = useSearchParams();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !readiness) {
    return <ErrorState message="Failed to load trip readiness score." />;
  }

  const handleNavigateToTab = (key: string) => {
    const tabKey = CHECK_TAB_MAP[key];
    if (tabKey) {
      setSearchParams({ tab: tabKey });
    }
  };

  const statusColor =
    readiness.scorePercentage === 100
      ? "success"
      : readiness.scorePercentage >= 60
      ? "warning"
      : "error";

  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack direction="row" spacing={3} sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <SpeedIcon color={statusColor} sx={{ fontSize: 48 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Trip Readiness Breakdown ({readiness.scorePercentage}%)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {readiness.isReady
                  ? "Your trip has passed all essential pre-ride readiness criteria!"
                  : "Complete the missing required items below before setting out."}
              </Typography>
            </Box>
          </Box>

          <Chip
            icon={readiness.isReady ? <CheckCircleIcon /> : <WarningIcon />}
            label={readiness.isReady ? "READY FOR TAKE-OFF" : "ACTION REQUIRED"}
            color={statusColor}
            sx={{ fontWeight: 700, fontSize: "0.9rem", py: 2.5, px: 1.5 }}
          />
        </Stack>

        <Box sx={{ mt: 3 }}>
          <LinearProgress
            variant="determinate"
            value={readiness.scorePercentage}
            color={statusColor}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
      </Paper>

      <Grid container spacing={2}>
        {readiness.items.map((item: ReadinessItem) => (
          <Grid key={item.key} size={{ xs: 12, sm: 6 }}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                height: "100%",
                borderColor: item.isPassed ? "success.light" : item.isRequired ? "error.light" : "divider",
                borderWidth: item.isPassed ? 1 : 2,
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      {CHECK_ICON_MAP[item.key] ?? <AccountBalanceWalletIcon color="primary" />}
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem" }}>
                        {item.title}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Chip
                        label={item.isRequired ? "Required" : "Recommended"}
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: "0.7rem", height: 20 }}
                      />
                      <Chip
                        icon={item.isPassed ? <CheckCircleIcon fontSize="small" /> : <WarningIcon fontSize="small" />}
                        label={item.isPassed ? "PASSED" : "PENDING"}
                        color={item.isPassed ? "success" : item.isRequired ? "error" : "warning"}
                        size="small"
                        sx={{ fontWeight: 700, fontSize: "0.68rem" }}
                      />
                    </Stack>
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    {item.message}
                  </Typography>

                  {!item.isPassed && (
                    <Box sx={{ pt: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleNavigateToTab(item.key)}
                      >
                        Fix / Add {item.title}
                      </Button>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
