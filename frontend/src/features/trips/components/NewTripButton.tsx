import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";

type NewTripButtonProps = {
  onClick: () => void;
};

export default function NewTripButton({
  onClick,
}: NewTripButtonProps) {
  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onClick}
    >
      New Trip
    </Button>
  );
}