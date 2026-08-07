import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";

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
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1,
        px: 1.5,
        borderRadius: 1,
        backgroundColor: "action.hover",
        transition: "background-color 0.2s",
        "&:hover": {
          backgroundColor: "action.selected",
        },
      }}
    >
      <Box sx={{ minWidth: 0, mr: 1 }}>
        <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
          {estimate.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatCurrency(estimate.estimatedAmount)}
        </Typography>
      </Box>

      <Stack direction="row" spacing={0.5}>
        <Tooltip title="Edit Estimate">
          <IconButton size="small" onClick={() => onEdit(estimate)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Estimate">
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(estimate)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}
