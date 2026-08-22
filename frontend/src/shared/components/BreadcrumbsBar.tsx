import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  to?: string;
  icon?: ReactNode;
}

interface BreadcrumbsBarProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbsBar({ items }: BreadcrumbsBarProps) {
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" sx={{ color: "text.disabled", fontSize: 16 }} />}
      aria-label="breadcrumb"
      sx={{ mb: 2.5 }}
    >
      <Link
        component={RouterLink}
        to="/"
        underline="hover"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          fontSize: "0.85rem",
          fontWeight: 500,
          color: "text.secondary",
          "&:hover": { color: "primary.main" },
        }}
      >
        <HomeIcon sx={{ fontSize: 16 }} />
        Home
      </Link>

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
          <Link
            key={index}
            component={RouterLink}
            to={item.to}
            underline="hover"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
