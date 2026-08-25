import AddIcon from "@mui/icons-material/Add";
import ExploreIcon from "@mui/icons-material/Explore";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "/", icon: <HomeIcon fontSize="small" /> },
    { label: "My Trips", path: "/trips", icon: <ExploreIcon fontSize="small" /> },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      {/* Modern Glassmorphic Top Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: "rgba(15, 23, 42, 0.08)",
          color: "text.primary",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 }, justifyContent: "space-between" }}>
            {/* Brand Logo */}
            <Box
              onClick={() => navigate("/")}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2.5,
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(37, 99, 235, 0.3)",
                }}
              >
                <TwoWheelerIcon sx={{ color: "#ffffff", fontSize: 22 }} />
              </Box>

              <Box>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                      color: "#0f172a",
                    }}
                  >
                    RidePlanner
                  </Typography>
                  <Chip
                    label="PRO"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      bgcolor: "rgba(37, 99, 235, 0.1)",
                      color: "primary.main",
                      borderRadius: 1,
                    }}
                  />
                </Stack>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                  }}
                >
                  Expedition & Journey Hub
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      startIcon={item.icon}
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        fontSize: "0.9rem",
                        fontWeight: active ? 700 : 500,
                        color: active ? "primary.main" : "text.secondary",
                        bgcolor: active ? "rgba(37, 99, 235, 0.08)" : "transparent",
                        "&:hover": {
                          bgcolor: active ? "rgba(37, 99, 235, 0.12)" : "rgba(15, 23, 42, 0.04)",
                          color: active ? "primary.dark" : "text.primary",
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Stack>
            )}

            {/* Header Right Actions */}
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/trips/new")}
                startIcon={<AddIcon />}
                size={isMobile ? "small" : "medium"}
                sx={{
                  fontWeight: 700,
                  px: { xs: 1.5, sm: 2.5 },
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                }}
              >
                Plan a Ride
              </Button>

              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                  sx={{ ml: 0.5 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            sx: { width: 280, p: 2, bgcolor: "background.paper" },
          },
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3, p: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TwoWheelerIcon sx={{ color: "#ffffff", fontSize: 20 }} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif' }}>
            RidePlanner
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <List>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    handleDrawerToggle();
                    navigate(item.path);
                  }}
                  selected={active}
                  sx={{
                    borderRadius: 2,
                    "&.Mui-selected": {
                      bgcolor: "rgba(37, 99, 235, 0.1)",
                      color: "primary.main",
                      "& .MuiListItemIcon-root": { color: "primary.main" },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38, color: active ? "primary.main" : "text.secondary" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: active ? 700 : 500, fontSize: "0.95rem" }}>
                        {item.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 2.5, sm: 3.5, md: 4 } }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>

      {/* Minimal Sleek Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "rgba(15, 23, 42, 0.06)",
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ justifyContent: "space-between", alignItems: "center", textAlign: "center" }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                  boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                RidePlanner Core Engine Online
              </Typography>
            </Stack>

            <Typography variant="caption" color="text.secondary">
              Built for motorcycle tourers, adventure riders & expedition squads.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}