import { Box, Grid, Typography } from "@mui/material";

import type {
  BudgetCategory,
  BudgetCategoryType,
  BudgetEstimate,
} from "../types/budget";
import CategoryCard from "./CategoryCard";

interface CategoryBreakdownProps {
  categories: BudgetCategory[];
  onAddEstimate: (categoryType: BudgetCategoryType) => void;
  onEditEstimate: (estimate: BudgetEstimate) => void;
  onDeleteEstimate: (estimate: BudgetEstimate) => void;
}

export default function CategoryBreakdown({
  categories,
  onAddEstimate,
  onEditEstimate,
  onDeleteEstimate,
}: CategoryBreakdownProps) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Category Breakdown
      </Typography>

      <Grid container spacing={3}>
        {categories.map((cat) => (
          <Grid key={cat.category} size={{ xs: 12, md: 6, lg: 4 }}>
            <CategoryCard
              category={cat}
              onAddEstimate={onAddEstimate}
              onEditEstimate={onEditEstimate}
              onDeleteEstimate={onDeleteEstimate}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
