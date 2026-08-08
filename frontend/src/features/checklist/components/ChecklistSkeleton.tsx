import { Box, Card, CardContent, Skeleton, Stack } from "@mui/material";

export default function ChecklistSkeleton() {
  return (
    <Stack spacing={3}>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Skeleton variant="text" width={220} height={32} />
              <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
            </Box>
            <Skeleton variant="rounded" width="100%" height={10} />
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {[1, 2, 3].map((key) => (
          <Card key={key} variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Skeleton variant="text" width={140} height={28} />
                  <Skeleton variant="circular" width={24} height={24} />
                </Box>
                <Skeleton variant="rounded" width="100%" height={1} />
                <Stack spacing={1}>
                  <Skeleton variant="text" width="80%" height={24} />
                  <Skeleton variant="text" width="65%" height={24} />
                  <Skeleton variant="text" width="75%" height={24} />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
