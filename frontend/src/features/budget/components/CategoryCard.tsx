import AddIcon from "@mui/icons-material/Add";
import BuildIcon from "@mui/icons-material/Build";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import HotelIcon from "@mui/icons-material/Hotel";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import PaymentsIcon from "@mui/icons-material/Payments";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import { formatCurrency } from "@/shared/utils/formatters";

import { CATEGORY_LABELS } from "../constants/categoryLabels";
import type {
  BudgetCategory,
  BudgetCategoryType,
  BudgetEstimate,
} from "../types/budget";
import EstimateItem from "./EstimateItem";

interface CategoryCardProps {
  category: BudgetCategory;
  onAddEstimate: (categoryType: BudgetCategoryType) => void;
  onEditEstimate: (estimate: BudgetEstimate) => void;
  onDeleteEstimate: (estimate: BudgetEstimate) => void;
}

const CATEGORY_ICON_MAP: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Fuel: { icon: <LocalGasStationIcon sx={{ fontSize: 16 }} />, color: "#38bdf8", bg: "rgba(56, 189, 248, 0.12)" },
  Lodging: { icon: <HotelIcon sx={{ fontSize: 16 }} />, color: "#bef264", bg: "rgba(190, 242, 100, 0.12)" },
  Food: { icon: <FastfoodIcon sx={{ fontSize: 16 }} />, color: "#fbbf24", bg: "rgba(251, 191, 36, 0.12)" },
  Permits: { icon: <ConfirmationNumberIcon sx={{ fontSize: 16 }} />, color: "#c084fc", bg: "rgba(192, 132, 252, 0.12)" },
  Maintenance: { icon: <BuildIcon sx={{ fontSize: 16 }} />, color: "#f87171", bg: "rgba(248, 113, 113, 0.12)" },
  Other: { icon: <PaymentsIcon sx={{ fontSize: 16 }} />, color: "#818cf8", bg: "rgba(129, 140, 248, 0.12)" },
};

export default function CategoryCard({
  category,
  onAddEstimate,
  onEditEstimate,
  onDeleteEstimate,
}: CategoryCardProps) {
  const categoryName = CATEGORY_LABELS[category.category] ?? category.category;
  const config = CATEGORY_ICON_MAP[category.category] || CATEGORY_ICON_MAP.Other;

  return (
    <Card
      className="neo-convex"
      sx={{
        borderRadius: 2.5,
        bgcolor: "#1a1a1e",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "rgba(129, 140, 248, 0.4)",
        },
      }}
    >
      <CardContent sx={{ p: 2, pb: 1.5, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Category Header Row */}
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.8,
                bgcolor: config.bg,
                color: config.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${config.color}33`,
              }}
            >
              {config.icon}
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#f8fafc", fontSize: "0.88rem" }}>
                {categoryName}
              </Typography>
              <Typography className="font-mono" sx={{ fontSize: "0.64rem", color: "#94a3b8" }}>
                {category.estimates.length} {category.estimates.length === 1 ? "Item" : "Items"}
              </Typography>
            </Box>
          </Stack>

          <Typography
            className="font-mono"
            sx={{
              fontWeight: 800,
              fontSize: "0.95rem",
              color: category.estimatedAmount > 0 ? config.color : "#71717a",
            }}
          >
            {formatCurrency(category.estimatedAmount)}
          </Typography>
        </Stack>

        {/* Estimate Items List or Compact Prompt */}
        <Box sx={{ flex: 1, mb: 1.5 }}>
          {category.estimates.length > 0 ? (
            <Stack spacing={0.8}>
              {category.estimates.map((estimate) => (
                <EstimateItem
                  key={estimate.id}
                  estimate={estimate}
                  onEdit={onEditEstimate}
                  onDelete={onDeleteEstimate}
                />
              ))}
            </Stack>
          ) : (
            <Box
              onClick={() => onAddEstimate(category.category)}
              sx={{
                py: 1.8,
                px: 1.5,
                textAlign: "center",
                bgcolor: "rgba(255, 255, 255, 0.02)",
                borderRadius: 2,
                border: "1px dashed rgba(255, 255, 255, 0.1)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(99, 102, 241, 0.08)",
                  borderColor: "#818cf8",
                },
              }}
            >
              <Typography className="font-mono" sx={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                + Add first {categoryName.toLowerCase()} estimate
              </Typography>
            </Box>
          )}
        </Box>

        {/* Quick Add Button */}
        {category.estimates.length > 0 && (
          <Button
            fullWidth
            variant="text"
            startIcon={<AddIcon sx={{ fontSize: 14 }} />}
            onClick={() => onAddEstimate(category.category)}
            sx={{
              fontSize: "0.68rem",
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 700,
              color: "#818cf8",
              bgcolor: "rgba(99, 102, 241, 0.06)",
              borderRadius: 1.5,
              py: 0.4,
              textTransform: "none",
              "&:hover": { bgcolor: "rgba(99, 102, 241, 0.15)" },
            }}
          >
            Add {categoryName} Item
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
