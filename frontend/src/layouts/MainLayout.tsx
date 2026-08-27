import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import ExploreIcon from "@mui/icons-material/Explore";
import HotelIcon from "@mui/icons-material/Hotel";
import MapIcon from "@mui/icons-material/Map";
import MenuIcon from "@mui/icons-material/Menu";
import PaymentsIcon from "@mui/icons-material/Payments";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import ShieldIcon from "@mui/icons-material/Shield";
import SpeedIcon from "@mui/icons-material/Speed";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
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
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { useTrips } from "@/features/trips";

const SIDEBAR_WIDTH = 230;

export default function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: trips = [] } = useTrips();
  const activeTrip = trips.find((t) => t.status === "Active");
  
  // Track last active / viewed trip
  const [lastActiveTripId, setLastActiveTripId] = useState<string | null>(() => {
    return localStorage.getItem("last_active_trip_id");
  });

  // Detect if we are inside a trip cockpit page (/trips/:id where id != 'new')
  const tripPathMatch = location.pathname.match(/^\/trips\/([^/]+)$/);
  const currentTripId = tripPathMatch && tripPathMatch[1] !== "new" ? tripPathMatch[1] : null;
  const currentTrip = currentTripId ? trips.find((t) => t.id === currentTripId) : null;

  useEffect(() => {
    if (currentTripId) {
      localStorage.setItem("last_active_trip_id", currentTripId);
      setLastActiveTripId(currentTripId);
    }
  }, [currentTripId]);

  const targetCockpitTripId = currentTripId || lastActiveTripId || activeTrip?.id || trips[0]?.id;
  const targetCockpitTrip = trips.find((t) => t.id === targetCockpitTripId);

  // Global Navigation items
  const globalNavItems = [
    { label: "Dashboard", path: "/", icon: <DashboardIcon fontSize="small" /> },
    { label: "Expeditions", path: "/trips", icon: <ExploreIcon fontSize="small" /> },
    ...(targetCockpitTripId
      ? [
          {
            label: "Cockpit",
            path: `/trips/${targetCockpitTripId}`,
            icon: <SpeedIcon fontSize="small" />,
            badge: targetCockpitTrip?.status === "Active" ? "LIVE" : undefined,
          },
        ]
      : []),
  ];

  // Contextual Trip Navigation sub-items when inside a trip
  const currentTab = searchParams.get("tab") || "overview";
  const tripSubNavItems = currentTripId
    ? [
        { label: "Overview", tab: "overview", icon: <SpeedIcon fontSize="small" /> },
        { label: "Itinerary", tab: "itinerary", icon: <MapIcon fontSize="small" /> },
        { label: "Lodging", tab: "accommodation", icon: <HotelIcon fontSize="small" /> },
        { label: "Budget & Fuel", tab: "budget", icon: <PaymentsIcon fontSize="small" /> },
        { label: "Gear Checklist", tab: "checklist", icon: <TaskAltIcon fontSize="small" /> },
        { label: "Permits & Docs", tab: "documents", icon: <DescriptionIcon fontSize="small" /> },
        { label: "Safety ICE", tab: "contacts", icon: <ShieldIcon fontSize="small" /> },
        { label: "Memories", tab: "memories", icon: <PhotoLibraryIcon fontSize="small" /> },
      ]
    : [];

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
      <Box sx={{ mb: 2.5, px: 0.5 }}>
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
              v1.0 Technical
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Contextual Trip Header OR Global New Mission Button */}
      {currentTrip ? (
        <Box sx={{ mb: 2 }}>
          <Button
            fullWidth
            size="small"
            startIcon={<ArrowBackIcon sx={{ fontSize: 14 }} />}
            onClick={() => {
              if (isMobile) setMobileOpen(false);
              navigate("/trips");
            }}
            sx={{
              mb: 1.5,
              py: 0.6,
              color: "#94a3b8",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.65rem",
              fontWeight: 700,
              justifyContent: "flex-start",
              textTransform: "uppercase",
              "&:hover": { color: "#ffffff", bgcolor: "rgba(255, 255, 255, 0.04)" },
            }}
          >
            All Expeditions
          </Button>

          <Box
            className="neo-inset"
            sx={{
              p: 1.2,
              borderRadius: 1.5,
              bgcolor: "#141313",
              border: "1px solid rgba(99, 102, 241, 0.25)",
            }}
          >
            <Stack direction="row" spacing={0.8} sx={{ alignItems: "center", mb: 0.4 }}>
              <Box
                className="pulse-telemetry glow-acid"
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: currentTrip.status === "Active" ? "#bef264" : "#818cf8",
                }}
              />
              <Typography
                className="font-mono"
                sx={{
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  color: currentTrip.status === "Active" ? "#bef264" : "#818cf8",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {currentTrip.status}
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              sx={{
                color: "#f8fafc",
                fontWeight: 800,
                fontSize: "0.78rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currentTrip.name}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ mb: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              if (isMobile) setMobileOpen(false);
              navigate("/trips/new");
            }}
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            sx={{
              py: 0.9,
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
            New Expedition
          </Button>
        </Box>
      )}

      {/* Navigation List: Contextual Trip Tabs OR Global Navigation */}
      <List sx={{ flexGrow: 1, p: 0, overflowY: "auto" }}>
        {currentTripId
          ? tripSubNavItems.map((item) => {
              const active = currentTab === item.tab;
              return (
                <ListItem key={item.tab} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => {
                      if (isMobile) setMobileOpen(false);
                      navigate(`/trips/${currentTripId}?tab=${item.tab}`);
                    }}
                    selected={active}
                    sx={{
                      borderRadius: 1.5,
                      py: 0.8,
                      px: 1.2,
                      bgcolor: active ? "#201f1f" : "transparent",
                      color: active ? "#818cf8" : "#94a3b8",
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
                        minWidth: 28,
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
                            fontSize: "0.7rem",
                            fontWeight: active ? 800 : 600,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {item.label}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })
          : globalNavItems.map((item) => {
              const active =
                item.path === "/"
                  ? location.pathname === "/"
                  : item.path === "/trips"
                  ? location.pathname === "/trips" || location.pathname === "/trips/new"
                  : location.pathname.startsWith(item.path);

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

      {/* Active Trip Telemetry Bar when on global pages */}
      {!currentTripId && activeTrip && (
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
              className="pulse-telemetry glow-acid"
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
            bgcolor: "#6366f1",
            color: "#ffffff",
            fontSize: "0.75rem",
            fontWeight: 800,
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          R
        </Avatar>
        <Box sx={{ overflow: "hidden" }}>
          <Typography
            variant="body2"
            sx={{ color: "#f8fafc", fontWeight: 700, fontSize: "0.75rem", lineHeight: 1.2 }}
          >
            Rider One
          </Typography>
          <Typography
            className="font-mono"
            variant="caption"
            sx={{ color: "#818cf8", fontSize: "0.6rem", fontWeight: 600 }}
          >
            READY
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#121416", overflowX: "hidden" }}>
      {/* Desktop Persistent Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: SIDEBAR_WIDTH },
          flexShrink: { md: 0 },
          display: { xs: "none", md: "block" },
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: SIDEBAR_WIDTH,
              border: "none",
            },
          }}
          open
        >
          {sidebarContent}
        </Drawer>
      </Box>

      {/* Mobile Temporary Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: SIDEBAR_WIDTH,
            border: "none",
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#121416",
          overflowX: "hidden",
        }}
      >
        {/* Mobile Header Bar */}
        {isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.5,
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              bgcolor: "#18181b",
            }}
          >
            <IconButton onClick={handleDrawerToggle} sx={{ color: "#f8fafc" }}>
              <MenuIcon />
            </IconButton>

            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <TwoWheelerIcon sx={{ color: "#818cf8", fontSize: 20 }} />
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 800,
                  fontStyle: "italic",
                  color: "#bef264",
                }}
              >
                RidePlanner
              </Typography>
            </Stack>

            <IconButton onClick={() => navigate("/trips/new")} sx={{ color: "#818cf8" }}>
              <AddIcon />
            </IconButton>
          </Box>
        )}

        {/* Dynamic Page Content Viewport */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 3.5 },
            maxWidth: "100%",
            boxSizing: "border-box",
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}