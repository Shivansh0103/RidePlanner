import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  to?: string;
  icon?: ReactNode;
}

interface BreadcrumbsBarProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbsBar({ items }: BreadcrumbsBarProps) {
  const navigate = useNavigate();

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" sx={{ color: "text.disabled", fontSize: 16 }} />}
      aria-label="breadcrumb"
      sx={{ mb: 2.5 }}
    >
      <Box
        onClick={() => navigate("/")}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          fontSize: "0.85rem",
          fontWeight: 500,
          color: "text.secondary",
          cursor: "pointer",
          "&:hover": { color: "primary.main" },
        }}
      >
        <HomeIcon sx={{ fontSize: 16 }} />
        Home
      </Box>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (isLast || !item.to) {
          return (
            <Typography
              key={index}
              sx={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {item.icon}
              {item.label}
            </Typography>
          );
        }

        return (
          <Box
            key={index}
            onClick={() => navigate(item.to!)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "text.secondary",
              cursor: "pointer",
              "&:hover": { color: "primary.main" },
            }}
          >
            {item.icon}
            {item.label}
          </Box>
        );
      })}
    </Breadcrumbs>
  );
}
