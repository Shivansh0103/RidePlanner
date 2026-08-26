import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { formatDate } from "@/shared/utils/date";

import type { TripDocument } from "../types/document";

interface DocumentCardProps {
  document: TripDocument;
  onEdit: (doc: TripDocument) => void;
  onDelete: (doc: TripDocument) => void;
}

export default function DocumentCard({ document: doc, onEdit, onDelete }: DocumentCardProps) {
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
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "#6366f1",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        <Stack spacing={1.8}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: "rgba(99, 102, 241, 0.12)",
                  color: "#818cf8",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DescriptionIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#f8fafc", fontSize: "0.95rem", lineHeight: 1.2 }}>
                  {doc.title}
                </Typography>
                <Chip
                  label={doc.type}
                  size="small"
                  sx={{
                    mt: 0.5,
                    height: 18,
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    bgcolor: "rgba(255, 255, 255, 0.06)",
                    color: "#bef264",
                    border: "1px solid rgba(190, 242, 100, 0.25)",
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                />
              </Box>
            </Stack>

            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" onClick={() => onEdit(doc)} aria-label="Edit document" sx={{ color: "#94a3b8", "&:hover": { color: "#818cf8" } }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(doc)} aria-label="Delete document" sx={{ color: "#94a3b8", "&:hover": { color: "#f87171" } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          {doc.documentNumber && (
            <Box className="neo-inset" sx={{ p: 1, borderRadius: 1.5, bgcolor: "#141313" }}>
              <Typography className="font-mono" sx={{ fontSize: "0.72rem", color: "#e4e4e7", fontWeight: 700 }}>
                ID: {doc.documentNumber}
              </Typography>
            </Box>
          )}

          <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", gap: 0.5 }}>
            {doc.expiryDate && (
              <Typography className="font-mono" sx={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                Expires: {formatDate(doc.expiryDate)}
              </Typography>
            )}

            {doc.isExpired && (
              <Chip
                icon={<WarningIcon sx={{ fontSize: "0.75rem !important" }} />}
                label="EXPIRED"
                size="small"
                sx={{
                  height: 20,
                  fontWeight: 700,
                  fontSize: "0.62rem",
                  bgcolor: "rgba(248, 113, 113, 0.15)",
                  color: "#f87171",
                  border: "1px solid rgba(248, 113, 113, 0.4)",
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              />
            )}

            {doc.isExpiringSoon && (
              <Chip
                icon={<WarningIcon sx={{ fontSize: "0.75rem !important" }} />}
                label="EXPIRING SOON"
                size="small"
                sx={{
                  height: 20,
                  fontWeight: 700,
                  fontSize: "0.62rem",
                  bgcolor: "rgba(251, 191, 36, 0.15)",
                  color: "#fbbf24",
                  border: "1px solid rgba(251, 191, 36, 0.4)",
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              />
            )}
          </Stack>

          {doc.notes && (
            <Typography variant="caption" sx={{ fontStyle: "italic", color: "#94a3b8", display: "block" }}>
              “{doc.notes}”
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
