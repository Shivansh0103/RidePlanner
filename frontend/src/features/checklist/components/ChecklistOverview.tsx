import AddIcon from "@mui/icons-material/Add";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import { Box, Button, Card, CardContent, LinearProgress, Stack, Typography } from "@mui/material";

interface ChecklistOverviewProps {
  completedItemsCount: number;
  totalItemsCount: number;
  completionPercentage: number;
  onAddCategory: () => void;
}

export default function ChecklistOverview({
  completedItemsCount,
  totalItemsCount,
  completionPercentage,
  onAddCategory,
}: ChecklistOverviewProps) {
  const isComplete = completionPercentage === 100 && totalItemsCount > 0;

  return (
    <Card
      className="neo-convex"
      sx={{
        borderRadius: 2.5,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent sx={{ p: 2.2 }}>
        <Stack spacing={1.8}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "rgba(190, 242, 100, 0.12)" : "rgba(79, 70, 229, 0.08)",
                  color: (theme) => (theme.palette.mode === "dark" ? "#bef264" : "primary.main"),
                  border: "1px solid",
                  borderColor: (theme) =>
                    theme.palette.mode === "dark" ? "rgba(190, 242, 100, 0.3)" : "rgba(79, 70, 229, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChecklistRtlIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "text.primary", fontSize: "1rem" }}
                >
                  Fleet & Gear Logistics Readiness
                </Typography>
                <Typography className="font-mono" sx={{ fontSize: "0.72rem", color: "text.secondary" }}>
                  {completedItemsCount} of {totalItemsCount} items ready ({completionPercentage}%)
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              size="small"
              endIcon={<AddIcon sx={{ fontSize: 15 }} />}
              onClick={onAddCategory}
              sx={{
                bgcolor: "primary.main",
                color: "#ffffff",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "0.72rem",
                fontWeight: 800,
                px: 1.6,
                py: 0.6,
                borderRadius: 2,
                textTransform: "none",
                alignSelf: { xs: "stretch", sm: "auto" },
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Add Category
            </Button>
          </Box>

          <Box sx={{ width: "100%" }}>
            <LinearProgress
              variant="determinate"
              value={completionPercentage}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 3,
                  bgcolor: (theme) =>
                    isComplete
                      ? theme.palette.mode === "dark"
                        ? "#bef264"
                        : "#059669"
                      : "primary.main",
                },
              }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
