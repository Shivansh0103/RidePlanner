import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Checkbox, Chip, IconButton, ListItem, Typography } from "@mui/material";

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
        py: 0.6,
        px: 1,
        borderRadius: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background-color 0.15s ease",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.03)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", minWidth: 0, mr: 1 }}>
        <Checkbox
          edge="start"
          checked={item.isCompleted}
          disabled={isToggling}
          onChange={(e) => onToggle(item.id, e.target.checked)}
          size="small"
          sx={{
            p: 0.5,
            color: "#52525b",
            "&.Mui-checked": {
              color: "#6366f1",
            },
          }}
        />
        <Typography
          variant="body2"
          sx={{
            textDecoration: item.isCompleted ? "line-through" : "none",
            color: item.isCompleted ? "#71717a" : "#f8fafc",
            fontWeight: item.isCompleted ? 400 : 600,
            fontSize: "0.82rem",
            transition: "color 0.2s ease, text-decoration 0.2s ease",
            wordBreak: "break-word",
            mr: 1,
          }}
        >
          {item.title}
        </Typography>

        {!item.isRequired && (
          <Chip
            label="Optional"
            size="small"
            sx={{
              height: 18,
              fontSize: "0.62rem",
              bgcolor: "rgba(255, 255, 255, 0.04)",
              color: "#94a3b8",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          />
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
        <IconButton
          size="small"
          aria-label="edit item"
          onClick={() => onEdit(item)}
          sx={{ color: "#71717a", "&:hover": { color: "#818cf8" } }}
        >
          <EditIcon sx={{ fontSize: 15 }} />
        </IconButton>
        <IconButton
          size="small"
          aria-label="delete item"
          onClick={() => onDelete(item)}
          sx={{ color: "#71717a", "&:hover": { color: "#f87171" } }}
        >
          <DeleteIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Box>
    </ListItem>
  );
}
