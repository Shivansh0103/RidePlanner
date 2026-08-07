import { Box, Card, CardContent, Grid, Skeleton, Stack } from "@mui/material";

export default function BudgetSkeleton() {
  return (
    <Stack spacing={4}>
      <Grid container spacing={3}>
        {[1, 2, 3].map((item) => (
          <Grid key={item} size={{ xs: 12, md: 4 }}>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="80%" height={40} sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Grid key={item} size={{ xs: 12, md: 6, lg: 4 }}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Skeleton variant="text" width="50%" height={28} />
                  <Skeleton variant="rectangular" height={100} sx={{ my: 2, borderRadius: 1 }} />
                  <Skeleton variant="rectangular" height={36} sx={{ borderRadius: 1 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
}
