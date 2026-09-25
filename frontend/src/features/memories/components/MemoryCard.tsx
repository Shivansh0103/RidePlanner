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
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "primary.main",
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
          sx={{ objectFit: "cover", borderBottom: "1px solid", borderColor: "divider" }}
        />
      )}

      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "text.primary", fontSize: "1rem", lineHeight: 1.2 }}>
                {memory.title}
              </Typography>

              <Typography className="font-mono" sx={{ fontSize: "0.72rem", color: "text.secondary", mt: 0.5, display: "block" }}>
                {formatDate(memory.memoryDate)}
              </Typography>
            </Box>

            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" onClick={() => onEdit(memory)} aria-label="Edit memory" sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(memory)} aria-label="Delete memory" sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          {memory.odometerReadingKm != null && (
            <Chip
              icon={<SpeedIcon sx={{ fontSize: "0.75rem !important", color: "primary.main !important" }} />}
              label={`${memory.odometerReadingKm.toLocaleString()} KM ODOMETER`}
              size="small"
              sx={{
                width: "fit-content",
                fontWeight: 700,
                fontSize: "0.68rem",
                fontFamily: '"JetBrains Mono", monospace',
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.12)" : "rgba(79, 70, 229, 0.08)",
                color: "primary.main",
                border: "1px solid",
                borderColor: (theme) =>
                  theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.3)" : "rgba(79, 70, 229, 0.25)",
              }}
            />
          )}

          {memory.content && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
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
