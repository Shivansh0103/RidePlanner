import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { formatCurrency } from "@/shared/utils/formatters";

import { CATEGORY_LABELS } from "../constants/categoryLabels";
import type {
  BudgetCategory,
  BudgetCategoryType,
  BudgetEstimate,
} from "../types/budget";
import EstimateItem from "./EstimateItem";

interface CategoryCardProps {
  category: BudgetCategory;
  onAddEstimate: (categoryType: BudgetCategoryType) => void;
  onEditEstimate: (estimate: BudgetEstimate) => void;
  onDeleteEstimate: (estimate: BudgetEstimate) => void;
}

export default function CategoryCard({
  category,
  onAddEstimate,
  onEditEstimate,
  onDeleteEstimate,
}: CategoryCardProps) {
  const categoryName =
    CATEGORY_LABELS[category.category] ?? category.category;

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        height: "100%",
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 2.5,
          "&:last-child": { pb: 2.5 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
            {categoryName}
          </Typography>
          <Typography
            variant="subtitle1"
            color="primary.main"
            sx={{ fontWeight: 700 }}
          >
            {formatCurrency(category.estimatedAmount)}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Estimate List or Empty State */}
        <Box sx={{ flexGrow: 1, mb: 2 }}>
          {category.estimates.length > 0 ? (
            <Stack spacing={1}>
              {category.estimates.map((estimate) => (
                <EstimateItem
                  key={estimate.id}
                  estimate={estimate}
                  onEdit={onEditEstimate}
                  onDelete={onDeleteEstimate}
                />
              ))}
            </Stack>
          ) : (
            <Box
              sx={{
                py: 3,
                px: 2,
                textAlign: "center",
                backgroundColor: "action.hover",
                borderRadius: 1.5,
                border: "1px dashed",
                borderColor: "divider",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No estimates in this category yet
              </Typography>
            </Box>
          )}
        </Box>

        {/* Add Estimate Button at Bottom */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => onAddEstimate(category.category)}
          size="small"
          aria-label={`Add estimate to ${categoryName}`}
          sx={{ mt: "auto" }}
        >
          Add Estimate
        </Button>
      </CardContent>
    </Card>
  );
}
