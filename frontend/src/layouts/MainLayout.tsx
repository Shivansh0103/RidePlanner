import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { Link as NavLink, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
            }}
          >
            🏍 Ride Planner
          </Typography>

          <Button
            color="inherit"
            component={NavLink}
            to="/"
          >
            Home
          </Button>

          <Button
            color="inherit"
            component={NavLink}
            to="/trips"
          >
            Trips
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}