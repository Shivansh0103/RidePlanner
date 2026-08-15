import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
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
      variant="outlined"
      sx={{
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderColor: contact.isPrimary ? "primary.main" : "divider",
        borderWidth: contact.isPrimary ? 2 : 1,
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
              <PersonIcon color="primary" fontSize="medium" />
              <Box>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem", lineHeight: 1.2 }}>
                    {contact.name}
                  </Typography>
                  {contact.isPrimary && (
                    <Chip
                      icon={<StarIcon fontSize="small" />}
                      label="PRIMARY"
                      color="primary"
                      size="small"
                      sx={{ height: 22, fontWeight: 700, fontSize: "0.68rem" }}
                    />
                  )}
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                  {contact.relationship}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" onClick={() => onEdit(contact)} aria-label="Edit contact">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => onDelete(contact)} aria-label="Delete contact">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.primary" }}>
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {contact.phone}
              </Typography>
            </Stack>

            {contact.alternatePhone && (
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}>
                <PhoneIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  Alt: {contact.alternatePhone}
                </Typography>
              </Stack>
            )}

            {contact.email && (
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}>
                <EmailIcon fontSize="small" color="action" />
                <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                  {contact.email}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
