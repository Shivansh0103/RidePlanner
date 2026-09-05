import LogoutIcon from "@mui/icons-material/Logout";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenSettings = () => {
    handleClose();
    navigate("/settings");
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate("/login", { replace: true });
  };

  const email = user?.email || "Rider";
  const userInitial = email.charAt(0).toUpperCase();
  const displayName = email.split("@")[0];

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
          borderRadius: 1.5,
          bgcolor: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.06)",
            borderColor: "rgba(99, 102, 241, 0.3)",
          },
        }}
      >
        <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", minWidth: 0 }}>
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
            {userInitial}
          </Avatar>
          <Box sx={{ overflow: "hidden", minWidth: 0 }}>
            <Tooltip title={email} enterDelay={500}>
              <Typography
                variant="body2"
                sx={{
                  color: "#f8fafc",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 120,
                }}
              >
                {displayName}
              </Typography>
            </Tooltip>
            <Stack direction="row" spacing={0.6} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  bgcolor: "#bef264",
                  boxShadow: "0 0 6px #bef264",
                }}
              />
              <Typography
                className="font-mono"
                variant="caption"
                sx={{ color: "#818cf8", fontSize: "0.6rem", fontWeight: 600 }}
              >
                READY
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <IconButton
          size="small"
          aria-label="rider account options"
          sx={{ color: "text.secondary", p: 0.3 }}
        >
          <MoreVertIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "left", vertical: "bottom" }}
        anchorOrigin={{ horizontal: "left", vertical: "top" }}
        slotProps={{
          paper: {
            sx: {
              width: 220,
              bgcolor: "#161b26",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
              borderRadius: 2,
              mb: 1,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "#94a3b8",
              fontFamily: 'monospace, "Fira Code", Courier',
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              mb: 0.3,
            }}
          >
            Authenticated Rider
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#f8fafc",
              fontWeight: 700,
              fontSize: "0.8rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {email}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.06)" }} />

        <MenuItem
          onClick={handleOpenSettings}
          sx={{
            py: 1,
            px: 2,
            color: "#f8fafc",
            "&:hover": {
              bgcolor: "rgba(99, 102, 241, 0.08)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "#818cf8", minWidth: 28 }}>
            <SettingsIcon sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 600 }}>
                Rider Settings
              </Typography>
            }
          />
        </MenuItem>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.06)" }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1,
            px: 2,
            color: "#f87171",
            "&:hover": {
              bgcolor: "rgba(248, 113, 113, 0.08)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "#f87171", minWidth: 28 }}>
            <LogoutIcon sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 600 }}>
                Log Out
              </Typography>
            }
          />
        </MenuItem>
      </Menu>
    </>
  );
};
