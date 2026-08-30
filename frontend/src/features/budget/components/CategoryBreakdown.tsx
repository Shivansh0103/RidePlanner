import AddIcon from "@mui/icons-material/Add";
import BuildIcon from "@mui/icons-material/Build";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import HotelIcon from "@mui/icons-material/Hotel";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import PaymentsIcon from "@mui/icons-material/Payments";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { formatCurrency } from "@/shared/utils/formatters";

import { CATEGORY_LABELS } from "../constants/categoryLabels";
import type {
  BudgetCategory,
  BudgetCategoryType,
  BudgetEstimate,
} from "../types/budget";
import EstimateItem from "./EstimateItem";

interface CategoryBreakdownProps {
  categories: BudgetCategory[];
  onAddEstimate: (categoryType: BudgetCategoryType) => void;
  onEditEstimate: (estimate: BudgetEstimate) => void;
  onDeleteEstimate: (estimate: BudgetEstimate) => void;
}

const CATEGORY_META: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string; description: string }
> = {
  Fuel: {
    icon: <LocalGasStationIcon sx={{ fontSize: 18 }} />,
    color: "#38bdf8",
    bg: "rgba(56, 189, 248, 0.12)",
    description: "Petrol, diesel, octane boosters & engine fluids",
  },
  Lodging: {
    icon: <HotelIcon sx={{ fontSize: 18 }} />,
    color: "#bef264",
    bg: "rgba(190, 242, 100, 0.12)",
    description: "Hotels, guest houses, campsites & homestays",
  },
  Food: {
    icon: <FastfoodIcon sx={{ fontSize: 18 }} />,
    color: "#fbbf24",
    bg: "rgba(251, 191, 36, 0.12)",
    description: "Meals, dhaba stops, hydration & trail snacks",
  },
  Permits: {
    icon: <ConfirmationNumberIcon sx={{ fontSize: 18 }} />,
    color: "#c084fc",
    bg: "rgba(192, 132, 252, 0.12)",
    description: "Inner Line Permits, state entry fees & highway tolls",
  },
  Maintenance: {
    icon: <BuildIcon sx={{ fontSize: 18 }} />,
    color: "#f87171",
    bg: "rgba(248, 113, 113, 0.12)",
    description: "Puncture repair kits, spare parts, chain lube & emergency spares",
  },
  Other: {
    icon: <PaymentsIcon sx={{ fontSize: 18 }} />,
    color: "#818cf8",
    bg: "rgba(129, 140, 248, 0.12)",
    description: "Souvenirs, unexpected expenses & miscellaneous supplies",
  },
};

export default function CategoryBreakdown({
  categories,
  onAddEstimate,
  onEditEstimate,
  onDeleteEstimate,
}: CategoryBreakdownProps) {
  const [selectedCategoryType, setSelectedCategoryType] = useState<BudgetCategoryType>(
    categories[0]?.category || "Fuel"
  );

  const totalPlanned = categories.reduce((sum, cat) => sum + cat.estimatedAmount, 0);
  const totalItems = categories.reduce((sum, cat) => sum + cat.estimates.length, 0);

  const selectedCategory =
    categories.find((c) => c.category === selectedCategoryType) || categories[0];

  const selectedMeta =
    CATEGORY_META[selectedCategory?.category || "Fuel"] || CATEGORY_META.Other;

  return (
    <Stack spacing={2.5} sx={{ mt: 3 }}>
      {/* 1. Header Banner with Distribution Telemetry */}
      <Card
        className="neo-convex"
        sx={{
          p: 2.2,
          borderRadius: 2.5,
          bgcolor: "#1a1a1e",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 1.5,
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "rgba(129, 140, 248, 0.15)",
                color: "#818cf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(129, 140, 248, 0.3)",
              }}
            >
              <PriceCheckIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#f8fafc", fontSize: "1rem" }}>
                Planned Category Allocations
              </Typography>
              <Typography className="font-mono" sx={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                {totalItems} Planned Items totaling{" "}
                <strong style={{ color: "#818cf8" }}>{formatCurrency(totalPlanned)}</strong>
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            size="small"
            endIcon={<AddIcon sx={{ fontSize: 15 }} />}
            onClick={() => onAddEstimate(selectedCategory?.category || "Fuel")}
            className="glow-indigo"
            sx={{
              bgcolor: "#6366f1",
              color: "#ffffff",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.72rem",
              fontWeight: 800,
              px: 1.6,
              py: 0.6,
              borderRadius: 2,
              textTransform: "none",
              "&:hover": { bgcolor: "#4f46e5" },
            }}
          >
            Add Estimate
          </Button>
        </Stack>
      </Card>

      {/* 2. Master-Detail Split Grid */}
      <Grid container spacing={2.5} sx={{ alignItems: "stretch" }}>
        {/* Left Column: Category Navigator (Master) */}
        <Grid size={{ xs: 12, md: 4.5, lg: 4 }}>
          <Paper
            className="neo-convex"
            sx={{
              p: 1.5,
              borderRadius: 2.5,
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography
              className="font-mono"
              sx={{
                px: 1,
                py: 0.5,
                fontSize: "0.66rem",
                color: "#71717a",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Categories ({categories.length})
            </Typography>

            <Stack spacing={1}>
              {categories.map((cat) => {
                const isSelected = cat.category === selectedCategoryType;
                const meta = CATEGORY_META[cat.category] || CATEGORY_META.Other;
                const catName = CATEGORY_LABELS[cat.category] ?? cat.category;
                const percentOfTotal =
                  totalPlanned > 0
                    ? Math.round((cat.estimatedAmount / totalPlanned) * 100)
                    : 0;

                return (
                  <Box
                    key={cat.category}
                    onClick={() => setSelectedCategoryType(cat.category)}
                    className={isSelected ? "neo-inset" : ""}
                    sx={{
                      p: 1.4,
                      borderRadius: 2,
                      bgcolor: isSelected ? "#141313" : "rgba(255, 255, 255, 0.02)",
                      border: isSelected
                        ? `1px solid ${meta.color}66`
                        : "1px solid rgba(255, 255, 255, 0.05)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: isSelected ? "#141313" : "rgba(255, 255, 255, 0.04)",
                        borderColor: isSelected ? `${meta.color}` : "rgba(255, 255, 255, 0.15)",
                        transform: isSelected ? "none" : "translateX(2px)",
                      },
                    }}
                  >
                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1.5,
                            bgcolor: meta.bg,
                            color: meta.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: `1px solid ${meta.color}33`,
                            flexShrink: 0,
                          }}
                        >
                          {meta.icon}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: isSelected ? 800 : 700,
                              color: isSelected ? "#f8fafc" : "#cbd5e1",
                              fontSize: "0.84rem",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {catName}
                          </Typography>
                          <Typography className="font-mono" sx={{ fontSize: "0.64rem", color: "#94a3b8" }}>
                            {cat.estimates.length} {cat.estimates.length === 1 ? "Item" : "Items"} · {percentOfTotal}% of total
                          </Typography>
                        </Box>
                      </Stack>

                      <Typography
                        className="font-mono"
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          color: cat.estimatedAmount > 0 ? meta.color : "#71717a",
                          flexShrink: 0,
                        }}
                      >
                        {formatCurrency(cat.estimatedAmount)}
                      </Typography>
                    </Stack>

                    {/* Mini allocation progress meter */}
                    <LinearProgress
                      variant="determinate"
                      value={percentOfTotal}
                      sx={{
                        mt: 1,
                        height: 3,
                        borderRadius: 2,
                        bgcolor: "rgba(255, 255, 255, 0.05)",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: meta.color,
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column: Detailed Estimation Ledger (Detail) */}
        <Grid size={{ xs: 12, md: 7.5, lg: 8 }}>
          <Paper
            className="neo-convex"
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: 2.5,
              bgcolor: "#1a1a1e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              {/* Category Detail Header */}
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  pb: 2,
                  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: 2,
                      bgcolor: selectedMeta.bg,
                      color: selectedMeta.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${selectedMeta.color}44`,
                    }}
                  >
                    {selectedMeta.icon}
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#f8fafc", fontSize: "1.05rem" }}>
                        {CATEGORY_LABELS[selectedCategory.category] ?? selectedCategory.category}
                      </Typography>
                      <Chip
                        label={`${selectedCategory.estimates.length} ${
                          selectedCategory.estimates.length === 1 ? "Item" : "Items"
                        }`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.64rem",
                          fontFamily: '"JetBrains Mono", monospace',
                          fontWeight: 700,
                          bgcolor: selectedMeta.bg,
                          color: selectedMeta.color,
                          border: `1px solid ${selectedMeta.color}44`,
                        }}
                      />
                    </Stack>
                    <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "0.72rem" }}>
                      {selectedMeta.description}
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ textAlign: "right" }}>
                  <Typography className="font-mono" sx={{ fontSize: "0.64rem", color: "#94a3b8", textTransform: "uppercase" }}>
                    Category Total
                  </Typography>
                  <Typography
                    className="font-mono"
                    sx={{ fontWeight: 800, fontSize: "1.2rem", color: selectedMeta.color }}
                  >
                    {formatCurrency(selectedCategory.estimatedAmount)}
                  </Typography>
                </Box>
              </Stack>

              {/* Estimate Items List */}
              <Box sx={{ pt: 2, minHeight: 220 }}>
                {selectedCategory.estimates.length > 0 ? (
                  <Stack spacing={1.2}>
                    {selectedCategory.estimates.map((estimate) => (
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
                    sx={{
                      py: 5,
                      px: 2,
                      textAlign: "center",
                      bgcolor: "rgba(255, 255, 255, 0.02)",
                      borderRadius: 2,
                      border: "1px dashed rgba(255, 255, 255, 0.08)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.5,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "0.82rem" }}>
                      No planned estimates registered under{" "}
                      {CATEGORY_LABELS[selectedCategory.category] ?? selectedCategory.category} yet.
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => onAddEstimate(selectedCategory.category)}
                      sx={{
                        color: selectedMeta.color,
                        borderColor: `${selectedMeta.color}66`,
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "none",
                        "&:hover": { borderColor: selectedMeta.color, bgcolor: selectedMeta.bg },
                      }}
                    >
                      Add First {CATEGORY_LABELS[selectedCategory.category] ?? selectedCategory.category} Item
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Bottom Add Action Bar */}
            {selectedCategory.estimates.length > 0 && (
              <Box sx={{ pt: 2, borderTop: "1px solid rgba(255, 255, 255, 0.06)", mt: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AddIcon sx={{ fontSize: 15 }} />}
                  onClick={() => onAddEstimate(selectedCategory.category)}
                  sx={{
                    color: selectedMeta.color,
                    borderColor: `${selectedMeta.color}44`,
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    py: 0.8,
                    borderRadius: 2,
                    textTransform: "none",
                    bgcolor: "rgba(255, 255, 255, 0.02)",
                    "&:hover": {
                      borderColor: selectedMeta.color,
                      bgcolor: selectedMeta.bg,
                    },
                  }}
                >
                  Add Another {CATEGORY_LABELS[selectedCategory.category] ?? selectedCategory.category} Item
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
