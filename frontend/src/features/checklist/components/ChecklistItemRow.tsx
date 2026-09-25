import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import { Box, Checkbox, Chip, IconButton, ListItem, Stack, Tooltip, Typography } from "@mui/material";

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
        borderRadius: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background-color 0.15s ease",
        bgcolor: item.isCompleted
          ? "transparent"
          : (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)"),
        border: "1px solid",
        borderColor: "divider",
        mb: 0.8,
        "&:hover": {
          backgroundColor: "action.hover",
          borderColor: "primary.main",
          "& .action-buttons": {
            opacity: 1,
          },
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", minWidth: 0, mr: 1, flex: 1 }}>
        <Checkbox
          edge="start"
          checked={item.isCompleted}
          disabled={isToggling}
          onChange={(e) => onToggle(item.id, e.target.checked)}
          size="small"
          sx={{
            p: 0.4,
            mr: 0.5,
            color: "text.secondary",
            "&.Mui-checked": {
              color: (theme) => (theme.palette.mode === "dark" ? "#bef264" : "#059669"),
            },
          }}
        />
        <Typography
          variant="body2"
          sx={{
            textDecoration: item.isCompleted ? "line-through" : "none",
            color: item.isCompleted ? "text.secondary" : "text.primary",
            fontWeight: item.isCompleted ? 400 : 600,
            fontSize: "0.8rem",
            transition: "all 0.2s ease",
            wordBreak: "break-word",
            mr: 1,
          }}
        >
          {item.title}
        </Typography>

        {item.isRequired && !item.isCompleted && (
          <Tooltip title="Mission-critical required item">
            <StarIcon sx={{ fontSize: 11, color: "#fbbf24", flexShrink: 0 }} />
          </Tooltip>
        )}

        {!item.isRequired && (
          <Chip
            label="Opt"
            size="small"
            sx={{
              height: 16,
              fontSize: "0.58rem",
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",
              color: "text.secondary",
              border: "1px solid",
              borderColor: "divider",
              fontFamily: '"JetBrains Mono", monospace',
            }}
          />
        )}
      </Box>

      <Stack
        className="action-buttons"
        direction="row"
        spacing={0.2}
        sx={{
          flexShrink: 0,
          opacity: { xs: 1, sm: 0.7 },
          transition: "opacity 0.2s ease",
        }}
      >
        <Tooltip title="Edit item">
          <IconButton
            size="small"
            aria-label="edit item"
            onClick={() => onEdit(item)}
            sx={{ p: 0.4, color: "text.secondary", "&:hover": { color: "primary.main", bgcolor: "action.hover" } }}
          >
            <EditIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete item">
          <IconButton
            size="small"
            aria-label="delete item"
            onClick={() => onDelete(item)}
            sx={{ p: 0.4, color: "text.secondary", "&:hover": { color: "error.main", bgcolor: "action.hover" } }}
          >
            <DeleteIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </ListItem>
  );
}
