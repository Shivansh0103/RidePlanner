import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FolderIcon from "@mui/icons-material/Folder";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  List,
  Stack,
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

  return (
    <Card
      className="neo-convex"
      sx={{
        borderRadius: 2.5,
        bgcolor: "#1a1a1e",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack spacing={2}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <FolderIcon sx={{ fontSize: 18, color: "#818cf8" }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#f8fafc", fontSize: "0.95rem" }}>
                {category.name}
              </Typography>
              <Chip
                label={`${category.completedItemsCount}/${category.totalItemsCount}`}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  fontFamily: '"JetBrains Mono", monospace',
                  bgcolor: isAllCompleted ? "rgba(190, 242, 100, 0.15)" : "rgba(255, 255, 255, 0.06)",
                  color: isAllCompleted ? "#bef264" : "#94a3b8",
                  border: isAllCompleted ? "1px solid rgba(190, 242, 100, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
                }}
              />
            </Box>

            <Stack direction="row" spacing={0.5}>
              <IconButton
                size="small"
                aria-label="edit category"
                onClick={() => onEditCategory(category)}
                sx={{ color: "#94a3b8", "&:hover": { color: "#818cf8" } }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label="delete category"
                onClick={() => onDeleteCategory(category)}
                sx={{ color: "#94a3b8", "&:hover": { color: "#f87171" } }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.06)" }} />

          {/* Items List */}
          {category.items.length === 0 ? (
            <Typography variant="body2" sx={{ py: 1, fontStyle: "italic", color: "#71717a", fontSize: "0.8rem" }}>
              No items logged in this category yet.
            </Typography>
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

          {/* Add Item Button */}
          <Box sx={{ pt: 0.5 }}>
            <Button
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 14 }} />}
              onClick={() => onAddItem(category.id)}
              sx={{
                color: "#818cf8",
                fontSize: "0.72rem",
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 700,
                "&:hover": { color: "#a5b4fc" },
              }}
            >
              + Add Item
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
