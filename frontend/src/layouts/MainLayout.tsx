import AddIcon from "@mui/icons-material/Add";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExploreIcon from "@mui/icons-material/Explore";
import MenuIcon from "@mui/icons-material/Menu";
import SpeedIcon from "@mui/icons-material/Speed";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
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
  const firstTrip = activeTrip || trips[0];

  const navItems = [
    { label: "Dashboard", path: "/", icon: <DashboardIcon fontSize="small" /> },
    { label: "My Expeditions", path: "/trips", icon: <ExploreIcon fontSize="small" /> },
    ...(firstTrip
      ? [
          {
            label: "Cockpit",
            path: `/trips/${firstTrip.id}`,
            icon: <SpeedIcon fontSize="small" />,
            badge: activeTrip ? "LIVE" : undefined,
          },
        ]
      : []),
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    if (path === "/trips") {
      return location.pathname === "/trips" || location.pathname === "/trips/new";
    }
    return location.pathname.startsWith(path);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const sidebarContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 2.5,
        bgcolor: "#1c1b1b",
        color: "#e5e2e1",
      }}
    >
      {/* Brand Header */}
      <Box sx={{ mb: 4, px: 1 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: "rgba(99, 102, 241, 0.15)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#818cf8",
              boxShadow: "0 0 12px rgba(99, 102, 241, 0.25)",
            }}
          >
            <TwoWheelerIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 800,
                fontStyle: "italic",
                color: "#bef264",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              RidePlanner
            </Typography>
            <Typography
              className="font-mono"
              variant="caption"
              sx={{
                color: "#94a3b8",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              v2.4 Technical
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Primary Action Button (New Mission / Trip) */}
      <Box sx={{ mb: 3 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            if (isMobile) setMobileOpen(false);
            navigate("/trips/new");
          }}
          startIcon={<AddIcon />}
          sx={{
            py: 1.3,
            bgcolor: "rgba(99, 102, 241, 0.08)",
            borderColor: "#6366f1",
            color: "#818cf8",
            fontWeight: 800,
            letterSpacing: "0.06em",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.78rem",
            textTransform: "uppercase",
            boxShadow: "0 0 16px rgba(99, 102, 241, 0.25)",
            "&:hover": {
              bgcolor: "#6366f1",
              borderColor: "#6366f1",
              color: "#ffffff",
              boxShadow: "0 0 24px rgba(99, 102, 241, 0.5)",
            },
          }}
        >
          New Mission
        </Button>
      </Box>

      {/* Navigation Links */}
      <List sx={{ flexGrow: 1, p: 0 }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  if (isMobile) setMobileOpen(false);
                  navigate(item.path);
                }}
                selected={active}
                sx={{
                  borderRadius: 2,
                  py: 1.3,
                  px: 2,
                  bgcolor: active ? "#201f1f" : "transparent",
                  color: active ? "#818cf8" : "#c7c6ca",
                  borderRight: active ? "4px solid #6366f1" : "4px solid transparent",
                  boxShadow: active ? "6px 6px 14px #0e0e11, -6px -6px 14px #22222a" : "none",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: active ? "#201f1f" : "rgba(255, 255, 255, 0.04)",
                    color: "#ffffff",
                    transform: "translateX(3px)",
                    "& .MuiListItemIcon-root": { color: "#818cf8" },
                  },
                  "&.Mui-selected": {
                    bgcolor: "#201f1f",
                    color: "#818cf8",
                    "& .MuiListItemIcon-root": { color: "#818cf8" },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: active ? "#818cf8" : "#909094",
                    filter: active ? "drop-shadow(0 0 8px rgba(99,102,241,0.6))" : "none",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      className="font-mono"
                      sx={{
                        fontSize: "0.78rem",
                        fontWeight: active ? 800 : 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.label}
                    </Typography>
                  }
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      bgcolor: "rgba(190, 242, 100, 0.15)",
                      color: "#bef264",
                      border: "1px solid rgba(190, 242, 100, 0.3)",
                      borderRadius: 1,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Active Trip Telemetry Bar (if active trip exists) */}
      {activeTrip && (
        <Box
          onClick={() => {
            if (isMobile) setMobileOpen(false);
            navigate(`/trips/${activeTrip.id}`);
          }}
          sx={{
            mb: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: "#141313",
            border: "1px solid rgba(190, 242, 100, 0.25)",
            boxShadow: "inset 2px 2px 6px #0e0e11, inset -2px -2px 6px #22222a",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "#bef264",
              boxShadow: "0 0 12px rgba(190, 242, 100, 0.2)",
            },
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.5 }}>
            <Box
              className="pulse-telemetry"
              sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#bef264" }}
            />
            <Typography
              className="font-mono"
              variant="caption"
              sx={{ color: "#bef264", fontWeight: 800, fontSize: "0.68rem", letterSpacing: "0.06em" }}
            >
              ACTIVE EXPEDITION
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            sx={{ color: "#f8fafc", fontWeight: 700, fontSize: "0.82rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {activeTrip.name}
          </Typography>
        </Box>
      )}

      {/* Divider */}
      <Divider sx={{ mb: 2, borderColor: "rgba(255, 255, 255, 0.08)" }} />

      {/* Bottom Profile / Commander Snippet */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 1.2,
          borderRadius: 2,
          bgcolor: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <Avatar
          sx={{
            width: 34,
            height: 34,
            bgcolor: "#2b2a2a",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            fontSize: "0.78rem",
            fontWeight: 800,
            color: "#818cf8",
          }}
        >
          RP
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            className="font-mono"
            sx={{
              fontSize: "0.74rem",
              fontWeight: 800,
              color: "#e5e2e1",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Commander
          </Typography>
          <Typography
            className="font-mono"
            sx={{ fontSize: "0.65rem", color: "#bef264", fontWeight: 700 }}
          >
            ID: 884-X9 // READY
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#141313", color: "#e5e2e1" }}>
      {/* Desktop Sidebar (Fixed Left 280px) */}
      {!isMobile && (
        <Box
          component="aside"
          sx={{
            width: 280,
            flexShrink: 0,
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 1200,
            borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "5px 0 20px rgba(0, 0, 0, 0.6)",
          }}
        >
          {sidebarContent}
        </Box>
      )}

      {/* Mobile Top Header */}
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 60,
            bgcolor: "#1c1b1b",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            zIndex: 1100,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <TwoWheelerIcon sx={{ color: "#818cf8", fontSize: 22 }} />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                fontStyle: "italic",
                color: "#bef264",
                fontFamily: '"Outfit", sans-serif',
              }}
            >
              RidePlanner
            </Typography>
          </Stack>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: 1.5 }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            sx: { width: 280, bgcolor: "#1c1b1b" },
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Content Area (Offset on Desktop by 280px) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: "280px" },
          mt: { xs: "60px", md: 0 },
          p: { xs: 2.5, sm: 3.5, md: 4.5 },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}