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
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
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
              <FolderIcon color="action" fontSize="small" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {category.name}
              </Typography>
              <Chip
                label={`${category.completedItemsCount}/${category.totalItemsCount}`}
                size="small"
                color={isAllCompleted ? "success" : "default"}
                variant={isAllCompleted ? "filled" : "outlined"}
                sx={{ height: 22, fontSize: "0.75rem", fontWeight: 600 }}
              />
            </Box>

            <Stack direction="row" spacing={0.5}>
              <IconButton
                size="small"
                aria-label="edit category"
                onClick={() => onEditCategory(category)}
                sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label="delete category"
                onClick={() => onDeleteCategory(category)}
                sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          <Divider />

          {/* Items List */}
          {category.items.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1, fontStyle: "italic" }}>
              No items in this category yet.
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
              startIcon={<AddIcon fontSize="small" />}
              onClick={() => onAddItem(category.id)}
              sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
            >
              Add Item
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
