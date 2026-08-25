import ExploreOffIcon from "@mui/icons-material/ExploreOff";
import HomeIcon from "@mui/icons-material/Home";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }} className="animate-fade-in">
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 4, sm: 6 },
          borderRadius: 3.5,
          bgcolor: "background.paper",
          borderColor: "rgba(15, 23, 42, 0.08)",
        }}
      >
        <Stack spacing={2.5} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "rgba(37, 99, 235, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.main",
            }}
          >
            <ExploreOffIcon sx={{ fontSize: 36 }} />
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: "text.primary" }}>
            404
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
            Off the Beaten Path
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
            The trail you are looking for does not exist or has been moved. Let's get you back to the main cockpit.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/"
            startIcon={<HomeIcon />}
            sx={{ fontWeight: 700, px: 3, mt: 1, boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)" }}
          >
            Return to Dashboard
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}