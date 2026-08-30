import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import type { EmergencyContact } from "../types/contact";

interface ContactCardProps {
  contact: EmergencyContact;
  onEdit: (contact: EmergencyContact) => void;
  onDelete: (contact: EmergencyContact) => void;
}

export default function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  return (
    <Card
      className="neo-convex"
      sx={{
        borderRadius: 2.5,
        height: "100%",
        bgcolor: "#1a1a1e",
        border: "1px solid",
        borderColor: contact.isPrimary ? "rgba(99, 102, 241, 0.5)" : "rgba(255, 255, 255, 0.08)",
        boxShadow: contact.isPrimary ? "0 0 16px rgba(99, 102, 241, 0.15)" : "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: contact.isPrimary ? "#818cf8" : "rgba(255, 255, 255, 0.15)",
        },
      }}
    >
      <CardContent sx={{ p: 2, pb: 2, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Stack spacing={1.5}>
          {/* Header Row: Contact Avatar, Name, Relationship, Primary Badge & Actions */}
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", minWidth: 0, flex: 1 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: contact.isPrimary ? "rgba(99, 102, 241, 0.15)" : "rgba(255, 255, 255, 0.04)",
                  color: contact.isPrimary ? "#818cf8" : "#94a3b8",
                  border: `1px solid ${contact.isPrimary ? "rgba(99, 102, 241, 0.35)" : "rgba(255, 255, 255, 0.08)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <PersonIcon sx={{ fontSize: 18 }} />
              </Box>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 800,
                      color: "#f8fafc",
                      fontSize: "0.92rem",
                      lineHeight: 1.2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {contact.name}
                  </Typography>
                  {contact.isPrimary && (
                    <Chip
                      icon={<StarIcon sx={{ fontSize: "0.68rem !important", color: "#bef264 !important" }} />}
                      label="PRIMARY"
                      size="small"
                      sx={{
                        height: 18,
                        fontWeight: 800,
                        fontSize: "0.58rem",
                        bgcolor: "rgba(190, 242, 100, 0.12)",
                        color: "#bef264",
                        border: "1px solid rgba(190, 242, 100, 0.3)",
                        fontFamily: '"JetBrains Mono", monospace',
                      }}
                    />
                  )}
                </Stack>

                <Typography className="font-mono" sx={{ fontSize: "0.64rem", color: "#94a3b8", mt: 0.2 }}>
                  {contact.relationship}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={0.3} sx={{ flexShrink: 0 }}>
              <Tooltip title="Edit contact">
                <IconButton
                  size="small"
                  onClick={() => onEdit(contact)}
                  aria-label="Edit contact"
                  sx={{ p: 0.4, color: "#94a3b8", "&:hover": { color: "#818cf8" } }}
                >
                  <EditIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete contact">
                <IconButton
                  size="small"
                  onClick={() => onDelete(contact)}
                  aria-label="Delete contact"
                  sx={{ p: 0.4, color: "#94a3b8", "&:hover": { color: "#f87171" } }}
                >
                  <DeleteIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Primary Phone Action Bar */}
          <Box
            className="neo-inset"
            sx={{
              p: 0.9,
              px: 1.2,
              borderRadius: 1.8,
              bgcolor: "#141313",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid rgba(255, 255, 255, 0.04)",
            }}
          >
            <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
              <PhoneIcon sx={{ fontSize: 14, color: "#818cf8" }} />
              <Typography className="font-mono" sx={{ fontSize: "0.76rem", fontWeight: 700, color: "#f8fafc" }}>
                {contact.phone}
              </Typography>
            </Stack>

            <Button
              size="small"
              variant="outlined"
              href={`tel:${contact.phone}`}
              sx={{
                height: 22,
                px: 1,
                fontSize: "0.62rem",
                fontWeight: 800,
                fontFamily: '"JetBrains Mono", monospace',
                borderColor: "rgba(190, 242, 100, 0.4)",
                color: "#bef264",
                borderRadius: 1.5,
                "&:hover": { borderColor: "#bef264", bgcolor: "rgba(190, 242, 100, 0.08)" },
              }}
            >
              CALL NOW
            </Button>
          </Box>

          {/* Secondary Info Rows */}
          <Stack spacing={0.4} sx={{ pt: 0.2 }}>
            {contact.alternatePhone ? (
              <Stack direction="row" spacing={0.6} sx={{ alignItems: "center" }}>
                <Typography className="font-mono" sx={{ fontSize: "0.66rem", color: "#71717a" }}>
                  ALT:
                </Typography>
                <Typography className="font-mono" sx={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 600 }}>
                  {contact.alternatePhone}
                </Typography>
              </Stack>
            ) : null}

            {contact.email ? (
              <Stack direction="row" spacing={0.6} sx={{ alignItems: "center" }}>
                <AlternateEmailIcon sx={{ fontSize: 12, color: "#71717a" }} />
                <Typography variant="caption" sx={{ fontSize: "0.68rem", color: "#94a3b8", wordBreak: "break-all" }}>
                  {contact.email}
                </Typography>
              </Stack>
            ) : null}

            {!contact.alternatePhone && !contact.email && (
              <Typography className="font-mono" sx={{ fontSize: "0.64rem", color: "#52525b" }}>
                Primary phone is single point of contact
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
