import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Checkbox, IconButton, ListItem, Typography } from "@mui/material";

import type { ChecklistItem } from "../types/checklist";

interface ChecklistItemRowProps {
  item: ChecklistItem;
  onToggle: (itemId: string, isCompleted: boolean) => void;
  onEdit: (item: ChecklistItem) => void;
  onDelete: (item: ChecklistItem) => void;
  isToggling?: boolean;
}

export default function ChecklistItemRow({
  item,
  onToggle,
  onEdit,
  onDelete,
  isToggling = false,
}: ChecklistItemRowProps) {
  return (
    <ListItem
      disableGutters
      sx={{
        py: 0.5,
        px: 1,
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background-color 0.15s ease",
        "&:hover": {
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(0, 0, 0, 0.02)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", minWidth: 0, mr: 1 }}>
        <Checkbox
          edge="start"
          checked={item.isCompleted}
          disabled={isToggling}
          onChange={(e) => onToggle(item.id, e.target.checked)}
          sx={{
            color: "text.secondary",
            "&.Mui-checked": {
              color: "success.main",
            },
          }}
        />
        <Typography
          variant="body2"
          sx={{
            textDecoration: item.isCompleted ? "line-through" : "none",
            color: item.isCompleted ? "text.secondary" : "text.primary",
            fontWeight: item.isCompleted ? 400 : 500,
            transition: "color 0.2s ease, text-decoration 0.2s ease",
            wordBreak: "break-word",
          }}
        >
          {item.title}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
        <IconButton
          size="small"
          aria-label="edit item"
          onClick={() => onEdit(item)}
          sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          aria-label="delete item"
          onClick={() => onDelete(item)}
          sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </ListItem>
  );
}
