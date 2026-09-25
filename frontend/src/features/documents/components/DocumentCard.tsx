import BadgeIcon from "@mui/icons-material/Badge";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EditIcon from "@mui/icons-material/Edit";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import SecurityIcon from "@mui/icons-material/Security";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { formatDate } from "@/shared/utils/date";

import type { TripDocument } from "../types/document";

interface DocumentCardProps {
  document: TripDocument;
  onEdit: (doc: TripDocument) => void;
  onDelete: (doc: TripDocument) => void;
}

function getDocumentConfig(type: string) {
  switch (type) {
    case "Passport":
    case "Visa":
      return {
        icon: <PermIdentityIcon sx={{ fontSize: 18 }} />,
        color: "#38bdf8",
        bg: "rgba(56, 189, 248, 0.12)",
      };
    case "Driving License":
      return {
        icon: <BadgeIcon sx={{ fontSize: 18 }} />,
        color: "#818cf8",
        bg: "rgba(129, 140, 248, 0.12)",
      };
    case "Vehicle RC":
      return {
        icon: <DirectionsCarIcon sx={{ fontSize: 18 }} />,
        color: "#bef264",
        bg: "rgba(190, 242, 100, 0.12)",
      };
    case "Insurance":
      return {
        icon: <SecurityIcon sx={{ fontSize: 18 }} />,
        color: "#34d399",
        bg: "rgba(52, 211, 153, 0.12)",
      };
    case "Permit":
      return {
        icon: <ConfirmationNumberIcon sx={{ fontSize: 18 }} />,
        color: "#c084fc",
        bg: "rgba(192, 132, 252, 0.12)",
      };
    default:
      return {
        icon: <DescriptionIcon sx={{ fontSize: 18 }} />,
        color: "text.secondary",
        bg: "action.hover",
      };
  }
}

export default function DocumentCard({ document: doc, onEdit, onDelete }: DocumentCardProps) {
  const [copied, setCopied] = useState(false);
  const config = getDocumentConfig(doc.type);

  const handleCopy = () => {
    if (doc.documentNumber) {
      navigator.clipboard.writeText(doc.documentNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

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
        justifyContent: "space-between",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "primary.main",
        },
      }}
    >
      <CardContent sx={{ p: 2, pb: 2, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Stack spacing={1.5}>
          {/* Header Row: Document Type Icon, Title, Badge & Actions */}
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", minWidth: 0, flex: 1 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: config.bg,
                  color: config.color,
                  border: `1px solid ${config.color}33`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {config.icon}
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 800,
                    color: "text.primary",
                    fontSize: "0.92rem",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {doc.title}
                </Typography>
                <Chip
                  label={doc.type}
                  size="small"
                  sx={{
                    mt: 0.3,
                    height: 18,
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    bgcolor: config.bg,
                    color: config.color,
                    border: `1px solid ${config.color}33`,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                />
              </Box>
            </Stack>

            <Stack direction="row" spacing={0.3} sx={{ flexShrink: 0 }}>
              <Tooltip title="Edit document">
                <IconButton
                  size="small"
                  onClick={() => onEdit(doc)}
                  aria-label="Edit document"
                  sx={{ p: 0.4, color: "text.secondary", "&:hover": { color: "primary.main" } }}
                >
                  <EditIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete document">
                <IconButton
                  size="small"
                  onClick={() => onDelete(doc)}
                  aria-label="Delete document"
                  sx={{ p: 0.4, color: "text.secondary", "&:hover": { color: "error.main" } }}
                >
                  <DeleteIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Document ID Number Bar */}
          <Box
            className="neo-inset"
            sx={{
              px: 1.2,
              py: 0.8,
              borderRadius: 1.8,
              bgcolor: (theme) => (theme.palette.mode === "dark" ? "#141313" : "#f8fafc"),
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              className="font-mono"
              sx={{
                fontSize: "0.74rem",
                color: doc.documentNumber ? "text.primary" : "text.secondary",
                fontWeight: 700,
              }}
            >
              {doc.documentNumber ? `ID: ${doc.documentNumber}` : "ID: Not Specified"}
            </Typography>

            {doc.documentNumber && (
              <Tooltip title={copied ? "Copied!" : "Copy Document ID"}>
                <IconButton
                  size="small"
                  onClick={handleCopy}
                  sx={{ p: 0.3, color: copied ? (theme) => (theme.palette.mode === "dark" ? "#bef264" : "#059669") : "text.secondary", "&:hover": { color: "text.primary" } }}
                >
                  <ContentCopyIcon sx={{ fontSize: 13 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Expiration & Alert Status */}
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
            <Typography className="font-mono" sx={{ fontSize: "0.68rem", color: "text.secondary" }}>
              {doc.expiryDate ? `Expires: ${formatDate(doc.expiryDate)}` : "Lifetime Validity"}
            </Typography>

            {doc.isExpired ? (
              <Chip
                icon={<WarningIcon sx={{ fontSize: "0.75rem !important" }} />}
                label="EXPIRED"
                size="small"
                sx={{
                  height: 18,
                  fontWeight: 800,
                  fontSize: "0.6rem",
                  bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(248, 113, 113, 0.15)" : "rgba(239, 68, 68, 0.1)"),
                  color: "error.main",
                  border: "1px solid",
                  borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(248, 113, 113, 0.4)" : "rgba(239, 68, 68, 0.3)"),
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              />
            ) : doc.isExpiringSoon ? (
              <Chip
                icon={<WarningIcon sx={{ fontSize: "0.75rem !important" }} />}
                label="EXPIRING SOON"
                size="small"
                sx={{
                  height: 18,
                  fontWeight: 800,
                  fontSize: "0.6rem",
                  bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(251, 191, 36, 0.15)" : "rgba(217, 119, 6, 0.1)"),
                  color: (theme) => (theme.palette.mode === "dark" ? "#fbbf24" : "#d97706"),
                  border: "1px solid",
                  borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(251, 191, 36, 0.4)" : "rgba(217, 119, 6, 0.3)"),
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              />
            ) : null}
          </Stack>

          {/* Notes Quote (if any) */}
          {doc.notes && (
            <Typography
              variant="caption"
              sx={{
                p: 0.8,
                bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)"),
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "divider",
                fontStyle: "italic",
                color: "text.secondary",
                fontSize: "0.72rem",
                display: "block",
                lineHeight: 1.3,
              }}
            >
              “{doc.notes}”
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
