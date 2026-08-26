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
      className="neo-convex"
      sx={{
        borderRadius: 2.5,
        height: "100%",
        bgcolor: "#1a1a1e",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "#6366f1",
          transform: "translateY(-2px)",
        },
      }}
    >
      {memory.imageUrl && (
        <CardMedia
          component="img"
          height="190"
          image={memory.imageUrl}
          alt={memory.title}
          sx={{ objectFit: "cover", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}
        />
      )}

      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#f8fafc", fontSize: "1rem", lineHeight: 1.2 }}>
                {memory.title}
              </Typography>

              <Typography className="font-mono" sx={{ fontSize: "0.72rem", color: "#94a3b8", mt: 0.5, display: "block" }}>
                {formatDate(memory.memoryDate)}
              </Typography>
            </Box>

            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" onClick={() => onEdit(memory)} aria-label="Edit memory" sx={{ color: "#94a3b8", "&:hover": { color: "#818cf8" } }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(memory)} aria-label="Delete memory" sx={{ color: "#94a3b8", "&:hover": { color: "#f87171" } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          {memory.odometerReadingKm != null && (
            <Chip
              icon={<SpeedIcon sx={{ fontSize: "0.75rem !important", color: "#818cf8 !important" }} />}
              label={`${memory.odometerReadingKm.toLocaleString()} KM ODOMETER`}
              size="small"
              sx={{
                width: "fit-content",
                fontWeight: 700,
                fontSize: "0.68rem",
                fontFamily: '"JetBrains Mono", monospace',
                bgcolor: "rgba(99, 102, 241, 0.12)",
                color: "#818cf8",
                border: "1px solid rgba(99, 102, 241, 0.3)",
              }}
            />
          )}

          {memory.content && (
            <Typography
              variant="body2"
              sx={{
                color: "#cbd5e1",
                whiteSpace: "pre-line",
                lineHeight: 1.6,
                fontSize: "0.82rem",
                mt: 0.5,
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
