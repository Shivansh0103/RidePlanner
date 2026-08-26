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
        bgcolor: "#1a1a1e",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: "rgba(190, 242, 100, 0.12)",
                  color: "#bef264",
                  border: "1px solid rgba(190, 242, 100, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChecklistRtlIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: "#f8fafc" }}
                >
                  Fleet & Gear Logistics Readiness
                </Typography>
                <Typography className="font-mono" sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  {completedItemsCount} of {totalItemsCount} checklist items prepared ({completionPercentage}%)
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              onClick={onAddCategory}
              className="glow-indigo"
              sx={{
                bgcolor: "#6366f1",
                color: "#ffffff",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.04em",
                alignSelf: { xs: "stretch", sm: "auto" },
                "&:hover": { bgcolor: "#4f46e5" },
              }}
            >
              Add Category
            </Button>
          </Box>

          <Box sx={{ width: "100%", mt: 0.5 }}>
            <LinearProgress
              variant="determinate"
              value={completionPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "rgba(255, 255, 255, 0.08)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  bgcolor: isComplete ? "#bef264" : "#6366f1",
                },
              }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
