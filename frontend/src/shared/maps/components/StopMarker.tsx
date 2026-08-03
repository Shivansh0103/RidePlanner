import { Box, Typography } from "@mui/material";

interface StopMarkerProps {
  number: number;
  selected?: boolean;
}

export default function StopMarker({ number, selected = false }: StopMarkerProps) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: selected ? 46 : 36,
        height: selected ? 46 : 36,
        bgcolor: selected ? "success.main" : "primary.main",
        color: "primary.contrastText",
        borderRadius: "50%",
        fontWeight: 700,
        fontSize: 16,
        border: "3px solid white",
        boxShadow: selected ? 8 : 3,
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {number}
      </Typography>

      <Box
        sx={{
          position: "absolute",
          bottom: -8,
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: (theme) =>
            `10px solid ${selected ? theme.palette.success.main : theme.palette.primary.main}`,
        }}
      />
    </Box>
  );
}
