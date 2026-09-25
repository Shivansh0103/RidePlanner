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
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: contact.isPrimary ? "primary.main" : "divider",
        boxShadow: contact.isPrimary
          ? (theme) => (theme.palette.mode === "dark" ? "0 0 16px rgba(99, 102, 241, 0.15)" : "0 4px 12px rgba(79, 70, 229, 0.1)")
          : "none",
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
          {/* Header Row: Contact Avatar, Name, Relationship, Primary Badge & Actions */}
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Stack direction="row" spacing={1.2} sx={{ alignItems: "center", minWidth: 0, flex: 1 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: contact.isPrimary
                    ? (theme) => (theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.15)" : "rgba(79, 70, 229, 0.1)")
                    : (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)"),
                  color: contact.isPrimary ? "primary.main" : "text.secondary",
                  border: "1px solid",
                  borderColor: contact.isPrimary ? "primary.main" : "divider",
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
                      color: "text.primary",
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
                      icon={
                        <StarIcon
                          sx={{
                            fontSize: "0.68rem !important",
                            color: (theme) => (theme.palette.mode === "dark" ? "#bef264 !important" : "#059669 !important"),
                          }}
                        />
                      }
                      label="PRIMARY"
                      size="small"
                      sx={{
                        height: 18,
                        fontWeight: 800,
                        fontSize: "0.58rem",
                        bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(190, 242, 100, 0.12)" : "rgba(5, 150, 105, 0.1)"),
                        color: (theme) => (theme.palette.mode === "dark" ? "#bef264" : "#059669"),
                        border: "1px solid",
                        borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(190, 242, 100, 0.3)" : "rgba(5, 150, 105, 0.3)"),
                        fontFamily: '"JetBrains Mono", monospace',
                      }}
                    />
                  )}
                </Stack>

                <Typography className="font-mono" sx={{ fontSize: "0.64rem", color: "text.secondary", mt: 0.2 }}>
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
                  sx={{ p: 0.4, color: "text.secondary", "&:hover": { color: "primary.main" } }}
                >
                  <EditIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete contact">
                <IconButton
                  size="small"
                  onClick={() => onDelete(contact)}
                  aria-label="Delete contact"
                  sx={{ p: 0.4, color: "text.secondary", "&:hover": { color: "error.main" } }}
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
              bgcolor: (theme) => (theme.palette.mode === "dark" ? "#141313" : "#f8fafc"),
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
              <PhoneIcon sx={{ fontSize: 14, color: "primary.main" }} />
              <Typography className="font-mono" sx={{ fontSize: "0.76rem", fontWeight: 700, color: "text.primary" }}>
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
                borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(190, 242, 100, 0.4)" : "rgba(5, 150, 105, 0.4)"),
                color: (theme) => (theme.palette.mode === "dark" ? "#bef264" : "#059669"),
                borderRadius: 1.5,
                "&:hover": {
                  borderColor: (theme) => (theme.palette.mode === "dark" ? "#bef264" : "#059669"),
                  bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(190, 242, 100, 0.08)" : "rgba(5, 150, 105, 0.08)"),
                },
              }}
            >
              CALL NOW
            </Button>
          </Box>

          {/* Secondary Info Rows */}
          <Stack spacing={0.4} sx={{ pt: 0.2 }}>
            {contact.alternatePhone ? (
              <Stack direction="row" spacing={0.6} sx={{ alignItems: "center" }}>
                <Typography className="font-mono" sx={{ fontSize: "0.66rem", color: "text.secondary" }}>
                  ALT:
                </Typography>
                <Typography className="font-mono" sx={{ fontSize: "0.68rem", color: "text.secondary", fontWeight: 600 }}>
                  {contact.alternatePhone}
                </Typography>
              </Stack>
            ) : null}

            {contact.email ? (
              <Stack direction="row" spacing={0.6} sx={{ alignItems: "center" }}>
                <AlternateEmailIcon sx={{ fontSize: 12, color: "text.secondary" }} />
                <Typography variant="caption" sx={{ fontSize: "0.68rem", color: "text.secondary", wordBreak: "break-all" }}>
                  {contact.email}
                </Typography>
              </Stack>
            ) : null}

            {!contact.alternatePhone && !contact.email && (
              <Typography className="font-mono" sx={{ fontSize: "0.64rem", color: "text.secondary" }}>
                Primary phone is single point of contact
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
