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

import { useTrips } from "@/features/trips";

export default function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: trips = [] } = useTrips();
  const activeTrip = trips.find((t) => t.status === "Active");

  const navItems = [
    { label: "Cockpit Dashboard", path: "/", icon: <HomeIcon fontSize="small" /> },
    { label: "My Expeditions", path: "/trips", icon: <ExploreIcon fontSize="small" /> },
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
      {/* Obsidian Velocity Glassmorphic Top Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(18, 20, 22, 0.82)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid",
          borderColor: "rgba(255, 255, 255, 0.08)",
          color: "text.primary",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 }, justifyContent: "space-between" }}>
            {/* Brand Logo & Telemetry Indicator */}
            <Stack direction="row" spacing={2.5} sx={{ alignItems: "center" }}>
              <Box
                onClick={() => navigate("/")}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  userSelect: "none",
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2.5,
                    background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 16px rgba(99, 102, 241, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <TwoWheelerIcon sx={{ color: "#ffffff", fontSize: 24 }} />
                </Box>

                <Box>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                        color: "#f8fafc",
                      }}
                    >
                      RIDEPLANNER
                    </Typography>
                    <Chip
                      label="VELOCITY"
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.62rem",
                        fontWeight: 800,
                        letterSpacing: "0.06em",
                        bgcolor: "rgba(99, 102, 241, 0.15)",
                        color: "#818cf8",
                        border: "1px solid rgba(99, 102, 241, 0.3)",
                        borderRadius: 1,
                      }}
                    />
                  </Stack>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#94a3b8",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      display: "block",
                      mt: 0.2,
                    }}
                  >
                    Expedition Cockpit & Routing Engine
                  </Typography>
                </Box>
              </Box>

              {/* Active Trip Telemetry Pill (if active expedition exists) */}
              {!isMobile && activeTrip && (
                <Chip
                  icon={
                    <Box
                      className="pulse-telemetry"
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#bef264",
                        ml: "6px !important",
                      }}
                    />
                  }
                  label={
                    <Typography
                      className="font-mono"
                      sx={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.02em" }}
                    >
                      ACTIVE: {activeTrip.name.toUpperCase()}
                    </Typography>
                  }
                  onClick={() => navigate(`/trips/${activeTrip.id}`)}
                  sx={{
                    bgcolor: "rgba(190, 242, 100, 0.1)",
                    color: "#bef264",
                    border: "1px solid rgba(190, 242, 100, 0.3)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(190, 242, 100, 0.18)",
                      borderColor: "rgba(190, 242, 100, 0.5)",
                    },
                  }}
                />
              )}
            </Stack>

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
                        px: 2.2,
                        py: 1,
                        borderRadius: 2,
                        fontSize: "0.88rem",
                        fontWeight: active ? 700 : 500,
                        color: active ? "#ffffff" : "#94a3b8",
                        bgcolor: active ? "rgba(99, 102, 241, 0.14)" : "transparent",
                        border: "1px solid",
                        borderColor: active ? "rgba(99, 102, 241, 0.35)" : "transparent",
                        boxShadow: active ? "0 0 12px rgba(99, 102, 241, 0.15)" : "none",
                        "&:hover": {
                          bgcolor: active ? "rgba(99, 102, 241, 0.2)" : "rgba(255, 255, 255, 0.04)",
                          color: "#ffffff",
                          borderColor: active ? "rgba(99, 102, 241, 0.5)" : "rgba(255, 255, 255, 0.1)",
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
                  px: { xs: 1.8, sm: 2.5 },
                  fontSize: { xs: "0.82rem", sm: "0.9rem" },
                }}
              >
                Plan Expedition
              </Button>

              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open navigation drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                  sx={{
                    ml: 0.5,
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 2,
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                  }}
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
            sx: {
              width: 300,
              p: 2.5,
              bgcolor: "#16181b",
              borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
            },
          },
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 3, p: 0.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 12px rgba(99, 102, 241, 0.4)",
            }}
          >
            <TwoWheelerIcon sx={{ color: "#ffffff", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: "#f8fafc" }}>
              RidePlanner
            </Typography>
            <Typography variant="caption" sx={{ color: "#818cf8", fontSize: "0.7rem", fontWeight: 700 }}>
              OBSIDIAN VELOCITY
            </Typography>
          </Box>
        </Stack>

        {activeTrip && (
          <Box sx={{ mb: 2 }}>
            <Chip
              icon={
                <Box
                  className="pulse-telemetry"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#bef264",
                    ml: "6px !important",
                  }}
                />
              }
              label={`ACTIVE: ${activeTrip.name}`}
              onClick={() => {
                handleDrawerToggle();
                navigate(`/trips/${activeTrip.id}`);
              }}
              sx={{
                width: "100%",
                justifyContent: "flex-start",
                bgcolor: "rgba(190, 242, 100, 0.1)",
                color: "#bef264",
                border: "1px solid rgba(190, 242, 100, 0.3)",
                fontWeight: 700,
                fontSize: "0.75rem",
              }}
            />
          </Box>
        )}

        <Divider sx={{ mb: 2, borderColor: "rgba(255, 255, 255, 0.08)" }} />

        <List>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.8 }}>
                <ListItemButton
                  onClick={() => {
                    handleDrawerToggle();
                    navigate(item.path);
                  }}
                  selected={active}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    "&.Mui-selected": {
                      bgcolor: "rgba(99, 102, 241, 0.16)",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      color: "#ffffff",
                      "& .MuiListItemIcon-root": { color: "#818cf8" },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38, color: active ? "#818cf8" : "#94a3b8" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: active ? 700 : 500, fontSize: "0.92rem", color: active ? "#f8fafc" : "#cbd5e1" }}>
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

      {/* Obsidian Velocity Cockpit Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          bgcolor: "rgba(18, 20, 22, 0.95)",
          borderTop: "1px solid",
          borderColor: "rgba(255, 255, 255, 0.06)",
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ justifyContent: "space-between", alignItems: "center", textAlign: "center" }}
          >
            <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#bef264",
                  boxShadow: "0 0 8px #bef264",
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#94a3b8", letterSpacing: "0.04em" }}>
                RIDEPLANNER VELOCITY ENGINE // ACTIVE
              </Typography>
            </Stack>

            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Engineered for motorcycle expeditions, route navigation & field logistics.
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}