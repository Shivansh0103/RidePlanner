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
        borderColor: contact.isPrimary ? "#6366f1" : "rgba(255, 255, 255, 0.08)",
        boxShadow: contact.isPrimary ? "0 0 16px rgba(99, 102, 241, 0.25)" : "none",
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
                  bgcolor: contact.isPrimary ? "rgba(99, 102, 241, 0.15)" : "rgba(255, 255, 255, 0.04)",
                  color: contact.isPrimary ? "#818cf8" : "#94a3b8",
                  border: `1px solid ${contact.isPrimary ? "rgba(99, 102, 241, 0.35)" : "rgba(255, 255, 255, 0.08)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PersonIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#f8fafc", fontSize: "0.95rem", lineHeight: 1.2 }}>
                    {contact.name}
                  </Typography>
                  {contact.isPrimary && (
                    <Chip
                      icon={<StarIcon sx={{ fontSize: "0.75rem !important", color: "#bef264 !important" }} />}
                      label="PRIMARY ICE"
                      size="small"
                      sx={{
                        height: 20,
                        fontWeight: 800,
                        fontSize: "0.62rem",
                        bgcolor: "rgba(190, 242, 100, 0.15)",
                        color: "#bef264",
                        border: "1px solid rgba(190, 242, 100, 0.3)",
                        fontFamily: '"JetBrains Mono", monospace',
                      }}
                    />
                  )}
                </Stack>

                <Typography variant="caption" sx={{ color: "#94a3b8", mt: 0.2, display: "block" }}>
                  {contact.relationship}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" onClick={() => onEdit(contact)} aria-label="Edit contact" sx={{ color: "#94a3b8", "&:hover": { color: "#818cf8" } }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(contact)} aria-label="Delete contact" sx={{ color: "#94a3b8", "&:hover": { color: "#f87171" } }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          <Box
            className="neo-inset"
            sx={{
              p: 1.2,
              borderRadius: 1.5,
              bgcolor: "#141313",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
              <PhoneIcon sx={{ fontSize: 15, color: "#818cf8" }} />
              <Typography className="font-mono" sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#f8fafc" }}>
                {contact.phone}
              </Typography>
            </Stack>

            <Button
              size="small"
              variant="outlined"
              href={`tel:${contact.phone}`}
              sx={{
                height: 24,
                px: 1,
                fontSize: "0.65rem",
                fontWeight: 700,
                fontFamily: '"JetBrains Mono", monospace',
                borderColor: "rgba(190, 242, 100, 0.4)",
                color: "#bef264",
                "&:hover": { borderColor: "#bef264", bgcolor: "rgba(190, 242, 100, 0.08)" },
              }}
            >
              CALL NOW
            </Button>
          </Box>

          {(contact.alternatePhone || contact.email) && (
            <Stack spacing={0.5}>
              {contact.alternatePhone && (
                <Typography className="font-mono" sx={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                  Alt Phone: {contact.alternatePhone}
                </Typography>
              )}
              {contact.email && (
                <Typography variant="caption" sx={{ color: "#94a3b8", wordBreak: "break-all" }}>
                  Email: {contact.email}
                </Typography>
              )}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
