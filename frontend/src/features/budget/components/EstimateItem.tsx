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
        bgcolor: "#141313",
        border: "1px solid rgba(255, 255, 255, 0.04)",
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: "#1c1b1b",
          borderColor: "rgba(255, 255, 255, 0.1)",
        },
      }}
    >
      <Box sx={{ minWidth: 0, mr: 1, flex: 1 }}>
        <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#f8fafc",
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
                bgcolor: "rgba(190, 242, 100, 0.1)",
                color: "#bef264",
                border: "1px solid rgba(190, 242, 100, 0.3)",
                fontFamily: '"JetBrains Mono", monospace',
              }}
            />
          )}
        </Stack>

        <Typography className="font-mono" sx={{ fontSize: "0.72rem", color: "#818cf8", fontWeight: 700, mt: 0.2 }}>
          {formatCurrency(estimate.estimatedAmount)}
        </Typography>
      </Box>

      <Stack direction="row" spacing={0.3} sx={{ flexShrink: 0 }}>
        <Tooltip title={`Edit ${estimate.title}`}>
          <IconButton
            size="small"
            aria-label={`Edit estimate ${estimate.title}`}
            onClick={() => onEdit(estimate)}
            sx={{ p: 0.4, color: "#94a3b8", "&:hover": { color: "#818cf8", bgcolor: "rgba(99, 102, 241, 0.1)" } }}
          >
            <EditOutlinedIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title={`Delete ${estimate.title}`}>
          <IconButton
            size="small"
            aria-label={`Delete estimate ${estimate.title}`}
            onClick={() => onDelete(estimate)}
            sx={{ p: 0.4, color: "#94a3b8", "&:hover": { color: "#f87171", bgcolor: "rgba(248, 113, 113, 0.1)" } }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}
