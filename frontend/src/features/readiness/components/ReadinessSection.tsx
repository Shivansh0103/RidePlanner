import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import HotelIcon from "@mui/icons-material/Hotel";
import SpeedIcon from "@mui/icons-material/Speed";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
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
  Route: <AltRouteIcon fontSize="small" />,
  Checklist: <ChecklistRtlIcon fontSize="small" />,
  Documents: <FolderSpecialIcon fontSize="small" />,
  Contacts: <ContactPhoneIcon fontSize="small" />,
  Accommodations: <HotelIcon fontSize="small" />,
  Budget: <AccountBalanceWalletIcon fontSize="small" />,
};

const CHECK_TAB_MAP: Record<string, string> = {
  Route: "itinerary",
  Checklist: "checklist",
  Documents: "documents",
  Contacts: "contacts",
  Accommodations: "accommodation",
  Budget: "budget",
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

  const isComplete = readiness.scorePercentage === 100;
  const isHigh = readiness.scorePercentage >= 70;

  const scoreColor = isComplete ? "#bef264" : isHigh ? "#fbbf24" : "#f87171";

  return (
    <Stack spacing={2.5} className="animate-fade-in">
      {/* 1. Sleek Hero Readiness Header */}
      <Paper
        className="glass-panel neo-convex"
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 2.5,
          bgcolor: "#1a1a1e",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2.5}
          sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            {/* Circular Gauge */}
            <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={58}
                thickness={5}
                sx={{ color: "#27272a" }}
              />
              <CircularProgress
                variant="determinate"
                value={readiness.scorePercentage}
                size={58}
                thickness={5}
                sx={{
                  color: scoreColor,
                  position: "absolute",
                  left: 0,
                  filter: isComplete ? "drop-shadow(0 0 6px rgba(190, 242, 100, 0.5))" : "none",
                }}
              />
              <Box sx={{ position: "absolute", textAlign: "center" }}>
                <Typography className="font-mono" sx={{ fontSize: "0.85rem", fontWeight: 800, color: "#f8fafc" }}>
                  {readiness.scorePercentage}%
                </Typography>
              </Box>
            </Box>

            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.3 }}>
                <SpeedIcon sx={{ fontSize: 18, color: scoreColor }} />
                <Typography
                  variant="h6"
                  sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "#f8fafc", fontSize: "1.1rem" }}
                >
                  Expedition Readiness Audit
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "0.8rem", maxWidth: 600 }}>
                {readiness.isReady
                  ? "All mission-critical preparation checks have been validated. You are cleared for departure."
                  : "Review pending pre-ride checklist items below to achieve 100% mission readiness."}
              </Typography>
            </Box>
          </Stack>

          {/* Status Badge */}
          <Box
            className="font-mono"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.8,
              px: 2,
              py: 0.8,
              borderRadius: 2,
              bgcolor: isComplete ? "rgba(190, 242, 100, 0.12)" : "rgba(251, 191, 36, 0.12)",
              border: `1px solid ${isComplete ? "#bef264" : "rgba(251, 191, 36, 0.4)"}`,
              color: isComplete ? "#bef264" : "#fbbf24",
              fontWeight: 800,
              fontSize: "0.74rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {readiness.isReady ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <WarningAmberIcon sx={{ fontSize: 16 }} />}
            {readiness.isReady ? "SYSTEMS NOMINAL / CLEARED" : "ACTION REQUIRED"}
          </Box>
        </Stack>

        <Box sx={{ mt: 2 }}>
          <LinearProgress
            variant="determinate"
            value={readiness.scorePercentage}
            sx={{
              height: 6,
              borderRadius: 9999,
              bgcolor: "#141313",
              "& .MuiLinearProgress-bar": {
                bgcolor: scoreColor,
                borderRadius: 9999,
              },
            }}
          />
        </Box>
      </Paper>

      {/* 2. Compact, Interactive Inspection Grid */}
      <Grid container spacing={1.8}>
        {readiness.items.map((item: ReadinessItem) => {
          const isPassed = item.isPassed;
          const isReq = item.isRequired;

          const itemBorderColor = isPassed
            ? "rgba(190, 242, 100, 0.3)"
            : isReq
            ? "rgba(248, 113, 113, 0.4)"
            : "rgba(251, 191, 36, 0.3)";

          const itemHoverBorder = isPassed ? "#bef264" : isReq ? "#f87171" : "#818cf8";
          const iconColor = isPassed ? "#bef264" : isReq ? "#f87171" : "#fbbf24";
          const tagBg = isPassed
            ? "rgba(190, 242, 100, 0.12)"
            : isReq
            ? "rgba(248, 113, 113, 0.12)"
            : "rgba(251, 191, 36, 0.12)";

          return (
            <Grid key={item.key} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card
                className="neo-convex"
                onClick={() => handleNavigateToTab(item.key)}
                sx={{
                  borderRadius: 2,
                  bgcolor: "#1a1a1e",
                  border: `1px solid ${itemBorderColor}`,
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    borderColor: itemHoverBorder,
                    bgcolor: "#1f1f24",
                    boxShadow: `0 6px 20px rgba(0, 0, 0, 0.5)`,
                    "& .action-arrow": {
                      transform: "translateX(4px)",
                      color: itemHoverBorder,
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Stack spacing={1.2}>
                    {/* Header Row: Icon + Title + Status Badge */}
                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: 1.5,
                            bgcolor: "#141313",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: iconColor,
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                          }}
                        >
                          {CHECK_ICON_MAP[item.key] ?? <AccountBalanceWalletIcon fontSize="small" />}
                        </Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 800, color: "#f8fafc", fontSize: "0.88rem" }}
                        >
                          {item.title}
                        </Typography>
                      </Stack>

                      <Box
                        className="font-mono"
                        sx={{
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          fontSize: "0.62rem",
                          fontWeight: 800,
                          letterSpacing: "0.04em",
                          bgcolor: tagBg,
                          color: iconColor,
                          border: `1px solid ${itemBorderColor}`,
                        }}
                      >
                        {isPassed ? "NOMINAL" : isReq ? "REQUIRED" : "RECOMMENDED"}
                      </Box>
                    </Stack>

                    {/* Message */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#94a3b8",
                        fontSize: "0.78rem",
                        lineHeight: 1.4,
                        minHeight: 34,
                      }}
                    >
                      {item.message}
                    </Typography>

                    {/* Footer Action Strip */}
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        pt: 0.5,
                        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <Typography
                        className="font-mono"
                        sx={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: isPassed ? "#bef264" : "#818cf8",
                        }}
                      >
                        {isPassed ? "✓ Configured" : `Configure ${item.title}`}
                      </Typography>

                      <ArrowForwardIcon
                        className="action-arrow"
                        sx={{
                          fontSize: 15,
                          color: "#71717a",
                          transition: "all 0.2s ease",
                        }}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
}
