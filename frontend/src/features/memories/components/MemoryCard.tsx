import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SpeedIcon from "@mui/icons-material/Speed";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { formatDate } from "@/shared/utils/date";
import type { TripMemory } from "../types/memory";

interface MemoryCardProps {
  memory: TripMemory;
  onEdit: (memory: TripMemory) => void;
  onDelete: (memory: TripMemory) => void;
}

export default function MemoryCard({ memory, onEdit, onDelete }: MemoryCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2.5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      {memory.imageUrl && (
        <CardMedia
          component="img"
          height="180"
          image={memory.imageUrl}
          alt={memory.title}
          sx={{ objectFit: "cover" }}
        />
      )}

      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.2 }}>
                {memory.title}
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                {formatDate(memory.memoryDate)}
              </Typography>
            </Box>

            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" onClick={() => onEdit(memory)} aria-label="Edit memory">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => onDelete(memory)} aria-label="Delete memory">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          {memory.odometerReadingKm != null && (
            <Chip
              icon={<SpeedIcon fontSize="small" />}
              label={`${memory.odometerReadingKm.toLocaleString()} KM`}
              variant="outlined"
              size="small"
              sx={{ width: "fit-content", fontWeight: 600, fontSize: "0.75rem" }}
            />
          )}

          {memory.content && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                whiteSpace: "pre-line",
                lineHeight: 1.6,
                mt: 1,
              }}
            >
              {memory.content}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
