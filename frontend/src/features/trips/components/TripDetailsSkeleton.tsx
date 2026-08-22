import { Box, Card, Grid, Paper, Skeleton, Stack } from "@mui/material";

export default function TripDetailsSkeleton() {
  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", width: "100%", pb: 6 }}>
      <Stack spacing={3}>
        {/* Breadcrumb Skeleton */}
        <Skeleton variant="text" width={240} height={24} />

        {/* Hero Header Card Skeleton */}
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 3,
            bgcolor: "background.paper",
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 1 }} />
              <Skeleton variant="text" width={160} height={20} />
            </Stack>

            <Skeleton variant="text" width="60%" height={44} />
            <Skeleton variant="text" width="85%" height={24} />

            <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
              <Skeleton variant="rounded" width={140} height={40} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rounded" width={110} height={40} sx={{ borderRadius: 2 }} />
            </Stack>
          </Stack>
        </Paper>

        {/* Tabs Bar Skeleton */}
        <Paper variant="outlined" sx={{ p: 1, borderRadius: 2.5 }}>
          <Stack direction="row" spacing={2} sx={{ overflowX: "hidden", py: 0.5 }}>
            <Skeleton variant="rounded" width={110} height={38} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rounded" width={110} height={38} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rounded" width={140} height={38} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rounded" width={140} height={38} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rounded" width={120} height={38} sx={{ borderRadius: 2 }} />
          </Stack>
        </Paper>

        {/* Content Body Cards Skeleton */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card variant="outlined" sx={{ p: 3, height: 380, borderRadius: 3 }}>
              <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
              <Skeleton variant="rounded" width="100%" height={280} sx={{ borderRadius: 2 }} />
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card variant="outlined" sx={{ p: 3, height: 380, borderRadius: 3 }}>
              <Skeleton variant="text" width={160} height={32} sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Skeleton variant="rounded" width="100%" height={65} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" width="100%" height={65} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" width="100%" height={65} sx={{ borderRadius: 2 }} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
