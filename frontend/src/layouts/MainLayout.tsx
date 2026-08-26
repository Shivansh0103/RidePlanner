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

const SIDEBAR_WIDTH = 230;

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
        p: 2,
        bgcolor: "#18181b",
        color: "#e5e2e1",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Brand Header */}
      <Box sx={{ mb: 3, px: 0.5 }}>
        <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: "rgba(99, 102, 241, 0.15)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#818cf8",
              boxShadow: "0 0 10px rgba(99, 102, 241, 0.25)",
            }}
          >
            <TwoWheelerIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
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
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              v2.4 Technical
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Primary Action Button */}
      <Box sx={{ mb: 2.5 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            if (isMobile) setMobileOpen(false);
            navigate("/trips/new");
          }}
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          sx={{
            py: 1,
            bgcolor: "rgba(99, 102, 241, 0.08)",
            borderColor: "#6366f1",
            color: "#818cf8",
            fontWeight: 800,
            letterSpacing: "0.06em",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.72rem",
            textTransform: "uppercase",
            boxShadow: "0 0 14px rgba(99, 102, 241, 0.2)",
            "&:hover": {
              bgcolor: "#6366f1",
              borderColor: "#6366f1",
              color: "#ffffff",
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
            <ListItem key={item.path} disablePadding sx={{ mb: 0.8 }}>
              <ListItemButton
                onClick={() => {
                  if (isMobile) setMobileOpen(false);
                  navigate(item.path);
                }}
                selected={active}
                sx={{
                  borderRadius: 1.5,
                  py: 1,
                  px: 1.5,
                  bgcolor: active ? "#201f1f" : "transparent",
                  color: active ? "#818cf8" : "#a1a1aa",
                  borderRight: active ? "3px solid #6366f1" : "3px solid transparent",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    bgcolor: active ? "#201f1f" : "rgba(255, 255, 255, 0.04)",
                    color: "#ffffff",
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
                    minWidth: 30,
                    color: active ? "#818cf8" : "#71717a",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      className="font-mono"
                      sx={{
                        fontSize: "0.72rem",
                        fontWeight: active ? 800 : 600,
                        letterSpacing: "0.06em",
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
                      height: 16,
                      fontSize: "0.55rem",
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

      {/* Active Trip Telemetry Bar */}
      {activeTrip && (
        <Box
          onClick={() => {
            if (isMobile) setMobileOpen(false);
            navigate(`/trips/${activeTrip.id}`);
          }}
          sx={{
            mb: 1.5,
            p: 1.2,
            borderRadius: 1.5,
            bgcolor: "#141313",
            border: "1px solid rgba(190, 242, 100, 0.25)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "#bef264",
            },
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.3 }}>
            <Box
              className="pulse-telemetry"
              sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#bef264" }}
            />
            <Typography
              className="font-mono"
              variant="caption"
              sx={{ color: "#bef264", fontWeight: 800, fontSize: "0.62rem", letterSpacing: "0.04em" }}
            >
              ACTIVE EXPEDITION
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            sx={{ color: "#f8fafc", fontWeight: 700, fontSize: "0.76rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {activeTrip.name}
          </Typography>
        </Box>
      )}

      <Divider sx={{ mb: 1.5, borderColor: "rgba(255, 255, 255, 0.08)" }} />

      {/* Bottom Profile Widget */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          p: 1,
          borderRadius: 1.5,
          bgcolor: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <Avatar
          sx={{
            width: 28,
            height: 28,
            bgcolor: "#27272a",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            fontSize: "0.7rem",
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
              fontSize: "0.68rem",
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
            sx={{ fontSize: "0.6rem", color: "#bef264", fontWeight: 700 }}
          >
            884-X9 // READY
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#141313", color: "#e5e2e1" }}>
      {/* Desktop Sidebar (Fixed Left 230px) */}
      {!isMobile && (
        <Box
          component="aside"
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 1200,
            boxShadow: "4px 0 16px rgba(0, 0, 0, 0.5)",
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
            height: 56,
            bgcolor: "#18181b",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            zIndex: 1100,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <TwoWheelerIcon sx={{ color: "#818cf8", fontSize: 20 }} />
            <Typography
              variant="subtitle2"
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
            size="small"
            sx={{ border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: 1 }}
          >
            <MenuIcon fontSize="small" />
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
            sx: { width: SIDEBAR_WIDTH, bgcolor: "#18181b" },
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Content Area (Fluid & Responsive) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
          mt: { xs: "56px", md: 0 },
          p: { xs: 2, sm: 2.5, md: 3 },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}