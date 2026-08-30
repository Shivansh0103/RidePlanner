import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import LuggageIcon from "@mui/icons-material/Luggage";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  List,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import type { ChecklistCategory, ChecklistItem } from "../types/checklist";
import ChecklistItemRow from "./ChecklistItemRow";

interface ChecklistCategoryCardProps {
  category: ChecklistCategory;
  onToggleItem: (itemId: string, isCompleted: boolean) => void;
  onAddItem: (categoryId: string) => void;
  onEditItem: (item: ChecklistItem) => void;
  onDeleteItem: (item: ChecklistItem) => void;
  onEditCategory: (category: ChecklistCategory) => void;
  onDeleteCategory: (category: ChecklistCategory) => void;
}

function getCategoryConfig(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("doc") || lower.includes("permit") || lower.includes("pass")) {
    return {
      icon: <DescriptionIcon sx={{ fontSize: 18 }} />,
      color: "#c084fc",
      bg: "rgba(192, 132, 252, 0.12)",
    };
  }
  if (lower.includes("vehic") || lower.includes("bike") || lower.includes("tool") || lower.includes("prep")) {
    return {
      icon: <TwoWheelerIcon sx={{ fontSize: 18 }} />,
      color: "#38bdf8",
      bg: "rgba(56, 189, 248, 0.12)",
    };
  }
  if (lower.includes("pack") || lower.includes("gear") || lower.includes("cloth") || lower.includes("luggage")) {
    return {
      icon: <LuggageIcon sx={{ fontSize: 18 }} />,
      color: "#bef264",
      bg: "rgba(190, 242, 100, 0.12)",
    };
  }
  return {
    icon: <PlaylistAddCheckIcon sx={{ fontSize: 18 }} />,
    color: "#818cf8",
    bg: "rgba(129, 140, 248, 0.12)",
  };
}

export default function ChecklistCategoryCard({
  category,
  onToggleItem,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onEditCategory,
  onDeleteCategory,
}: ChecklistCategoryCardProps) {
  const isAllCompleted =
    category.totalItemsCount > 0 &&
    category.completedItemsCount === category.totalItemsCount;

  const percent =
    category.totalItemsCount > 0
      ? Math.round((category.completedItemsCount / category.totalItemsCount) * 100)
      : 0;

  const config = getCategoryConfig(category.name);

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
          borderColor: `${config.color}55`,
        },
      }}
    >
      <CardContent sx={{ p: 2, pb: 1.5, flex: 1, display: "flex", flexDirection: "column" }}>
        <Stack spacing={1.5} sx={{ flex: 1 }}>
          {/* Header Row: Category Icon + Title + Count Badge + Edit/Delete */}
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", minWidth: 0, flex: 1 }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  bgcolor: config.bg,
                  color: config.color,
                  border: `1px solid ${config.color}33`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {config.icon}
              </Box>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 800,
                    color: "#f8fafc",
                    fontSize: "0.92rem",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {category.name}
                </Typography>
                <Typography className="font-mono" sx={{ fontSize: "0.64rem", color: "#94a3b8" }}>
                  {category.completedItemsCount} of {category.totalItemsCount} ready ({percent}%)
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={0.3} sx={{ flexShrink: 0 }}>
              <Tooltip title="Edit category">
                <IconButton
                  size="small"
                  aria-label="edit category"
                  onClick={() => onEditCategory(category)}
                  sx={{ p: 0.5, color: "#94a3b8", "&:hover": { color: "#818cf8" } }}
                >
                  <EditIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete category">
                <IconButton
                  size="small"
                  aria-label="delete category"
                  onClick={() => onDeleteCategory(category)}
                  sx={{ p: 0.5, color: "#94a3b8", "&:hover": { color: "#f87171" } }}
                >
                  <DeleteIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Category Progress Line */}
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{
              height: 4,
              borderRadius: 2,
              bgcolor: "rgba(255, 255, 255, 0.06)",
              "& .MuiLinearProgress-bar": {
                bgcolor: isAllCompleted ? "#bef264" : config.color,
                borderRadius: 2,
              },
            }}
          />

          {/* Items List */}
          <Box sx={{ flex: 1, my: 0.5, minHeight: 120 }}>
            {category.items.length === 0 ? (
              <Box
                onClick={() => onAddItem(category.id)}
                sx={{
                  py: 3,
                  px: 1.5,
                  textAlign: "center",
                  bgcolor: "rgba(255, 255, 255, 0.02)",
                  borderRadius: 2,
                  border: "1px dashed rgba(255, 255, 255, 0.08)",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "rgba(99, 102, 241, 0.08)", borderColor: "#818cf8" },
                }}
              >
                <Typography className="font-mono" sx={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                  + Add first {category.name.toLowerCase()} item
                </Typography>
              </Box>
            ) : (
              <List disablePadding>
                {category.items.map((item) => (
                  <ChecklistItemRow
                    key={item.id}
                    item={item}
                    onToggle={onToggleItem}
                    onEdit={onEditItem}
                    onDelete={onDeleteItem}
                  />
                ))}
              </List>
            )}
          </Box>
        </Stack>
      </CardContent>

      {/* Footer Add Button */}
      {category.items.length > 0 && (
        <Box sx={{ p: 1.5, pt: 0, borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <Button
            fullWidth
            size="small"
            endIcon={<AddIcon sx={{ fontSize: 14 }} />}
            onClick={() => onAddItem(category.id)}
            sx={{
              color: config.color,
              bgcolor: "rgba(255, 255, 255, 0.02)",
              fontSize: "0.72rem",
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 700,
              py: 0.5,
              borderRadius: 1.8,
              textTransform: "none",
              "&:hover": {
                bgcolor: config.bg,
              },
            }}
          >
            Add Item
          </Button>
        </Box>
      )}
    </Card>
  );
}
