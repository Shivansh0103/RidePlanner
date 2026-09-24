import DeleteOutlineIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/Edit";
import HotelIcon from "@mui/icons-material/Hotel";
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";

import { formatCurrency } from "@/shared/utils/formatters";

import type { BudgetEstimate } from "../types/budget";

interface EstimateItemProps {
  estimate: BudgetEstimate;
  onEdit: (estimate: BudgetEstimate) => void;
  onDelete: (estimate: BudgetEstimate) => void;
}

export default function EstimateItem({
  estimate,
  onEdit,
  onDelete,
}: EstimateItemProps) {
  const isSyncedStay = !!estimate.accommodationId;

  return (
    <Box
      className="neo-inset"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 0.8,
        px: 1.2,
        borderRadius: 1.5,
        bgcolor: (theme) => (theme.palette.mode === "dark" ? "#141313" : "#f8fafc"),
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: (theme) => (theme.palette.mode === "dark" ? "#1c1b1b" : "#f1f5f9"),
          borderColor: "primary.main",
        },
      }}
    >
      <Box sx={{ minWidth: 0, mr: 1, flex: 1 }}>
        <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
          <Typography
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: "0.78rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {estimate.title}
          </Typography>
          {isSyncedStay && (
            <Chip
              icon={<HotelIcon sx={{ fontSize: 11 }} />}
              label="Stay"
              size="small"
              sx={{
                height: 18,
                fontSize: "0.6rem",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "rgba(190, 242, 100, 0.1)" : "rgba(79, 70, 229, 0.08)",
                color: (theme) => (theme.palette.mode === "dark" ? "#bef264" : "primary.main"),
                border: "1px solid",
                borderColor: (theme) =>
                  theme.palette.mode === "dark" ? "rgba(190, 242, 100, 0.3)" : "rgba(79, 70, 229, 0.25)",
                fontFamily: '"JetBrains Mono", monospace',
              }}
            />
          )}
        </Stack>

        <Typography className="font-mono" sx={{ fontSize: "0.72rem", color: "primary.main", fontWeight: 700, mt: 0.2 }}>
          {formatCurrency(estimate.estimatedAmount)}
        </Typography>
      </Box>

      <Stack direction="row" spacing={0.3} sx={{ flexShrink: 0 }}>
        <Tooltip title={`Edit ${estimate.title}`}>
          <IconButton
            size="small"
            aria-label={`Edit estimate ${estimate.title}`}
            onClick={() => onEdit(estimate)}
            sx={{ p: 0.4, color: "text.secondary", "&:hover": { color: "primary.main", bgcolor: "action.hover" } }}
          >
            <EditOutlinedIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title={`Delete ${estimate.title}`}>
          <IconButton
            size="small"
            aria-label={`Delete estimate ${estimate.title}`}
            onClick={() => onDelete(estimate)}
            sx={{ p: 0.4, color: "text.secondary", "&:hover": { color: "error.main", bgcolor: "action.hover" } }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}
