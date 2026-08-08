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
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
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
              <ChecklistRtlIcon color="primary" sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Preparation Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {completedItemsCount} of {totalItemsCount} items completed ({completionPercentage}%)
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddCategory}
              size="small"
              sx={{ alignSelf: { xs: "stretch", sm: "auto" } }}
            >
              Add Category
            </Button>
          </Box>

          <Box sx={{ width: "100%", mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={completionPercentage}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 5,
                  backgroundColor:
                    completionPercentage === 100 ? "success.main" : "primary.main",
                },
              }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
