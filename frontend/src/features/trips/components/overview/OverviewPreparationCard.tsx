import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import { useToggleChecklistItem } from "@/features/checklist/hooks/useToggleChecklistItem";
import type { ChecklistSummary } from "@/features/checklist/types/checklist";
import { getTopPendingChecklistItems } from "@/features/trips/utils/tripOverviewSelectors";

interface OverviewPreparationCardProps {
  tripId: string;
  checklist?: ChecklistSummary | null;
}

export default function OverviewPreparationCard({ tripId, checklist }: OverviewPreparationCardProps) {
  const toggleItemMutation = useToggleChecklistItem(tripId);
  const pendingItems = getTopPendingChecklistItems(checklist, 3);

  const completedCount = checklist?.completedItemsCount ?? 0;
  const totalCount = checklist?.totalItemsCount ?? 0;
  const isAllComplete = totalCount > 0 && completedCount === totalCount;

  const handleToggle = (itemId: string, currentCompleted: boolean) => {
    toggleItemMutation.mutate({
      itemId,
      isCompleted: !currentCompleted,
    });
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ChecklistRtlIcon color="primary" fontSize="small" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Preparation Tasks
              </Typography>
            </Box>
            <Chip
              label={`${completedCount} / ${totalCount} ready`}
              size="small"
              color={isAllComplete ? "success" : "default"}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {isAllComplete ? (
            <Box
              sx={{
                p: 2.5,
                textAlign: "center",
                borderRadius: 2,
                bgcolor: "success.50",
                border: "1px solid",
                borderColor: "success.main",
              }}
            >
              <DoneAllIcon color="success" sx={{ fontSize: 32, mb: 0.5 }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: "success.dark" }}>
                All preparation tasks complete!
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Your trip is fully packed and prepared.
              </Typography>
            </Box>
          ) : pendingItems.length > 0 ? (
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Pending Action Items:
              </Typography>
              <List disablePadding>
                {pendingItems.map((item) => (
                  <ListItem
                    key={item.id}
                    disableGutters
                    sx={{
                      py: 0.5,
                      px: 1,
                      borderRadius: 1.5,
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Checkbox
                        edge="start"
                        size="small"
                        checked={item.isCompleted}
                        disabled={toggleItemMutation.isPending}
                        onChange={() => handleToggle(item.id, item.isCompleted)}
                        slotProps={{
                          input: { "aria-label": `Toggle ${item.title}` },
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {item.categoryName}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Stack>
          ) : (
            <Box
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No checklist items created yet.
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
