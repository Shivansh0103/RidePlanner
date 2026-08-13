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
      variant="outlined"
      sx={{
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <DescriptionIcon color="primary" fontSize="medium" />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem", lineHeight: 1.2 }}>
                  {doc.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                  {doc.type}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" onClick={() => onEdit(doc)} aria-label="Edit document">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => onDelete(doc)} aria-label="Delete document">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          {doc.documentNumber && (
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Doc #: {doc.documentNumber}
            </Typography>
          )}

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {doc.expiryDate && (
              <Typography variant="caption" color="text.secondary">
                Expires: {formatDate(doc.expiryDate)}
              </Typography>
            )}

            {doc.isExpired && (
              <Chip
                icon={<WarningIcon fontSize="small" />}
                label="EXPIRED"
                color="error"
                size="small"
                sx={{ height: 22, fontWeight: 700, fontSize: "0.68rem" }}
              />
            )}

            {doc.isExpiringSoon && (
              <Chip
                icon={<WarningIcon fontSize="small" />}
                label="EXPIRING SOON"
                color="warning"
                size="small"
                sx={{ height: 22, fontWeight: 700, fontSize: "0.68rem" }}
              />
            )}
          </Stack>

          {doc.notes && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
              {doc.notes}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
