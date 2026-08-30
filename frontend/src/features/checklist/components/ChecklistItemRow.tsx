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
        bgcolor: item.isCompleted ? "rgba(255, 255, 255, 0.01)" : "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.04)",
        mb: 0.8,
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          borderColor: "rgba(255, 255, 255, 0.08)",
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
            color: "#52525b",
            "&.Mui-checked": {
              color: "#bef264",
            },
          }}
        />
        <Typography
          variant="body2"
          sx={{
            textDecoration: item.isCompleted ? "line-through" : "none",
            color: item.isCompleted ? "#71717a" : "#f8fafc",
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
              bgcolor: "rgba(255, 255, 255, 0.04)",
              color: "#71717a",
              border: "1px solid rgba(255, 255, 255, 0.06)",
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
            sx={{ p: 0.4, color: "#71717a", "&:hover": { color: "#818cf8", bgcolor: "rgba(99, 102, 241, 0.1)" } }}
          >
            <EditIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete item">
          <IconButton
            size="small"
            aria-label="delete item"
            onClick={() => onDelete(item)}
            sx={{ p: 0.4, color: "#71717a", "&:hover": { color: "#f87171", bgcolor: "rgba(248, 113, 113, 0.1)" } }}
          >
            <DeleteIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </ListItem>
  );
}
