import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

type CreateTripDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateTripDialog({ open, onClose }: CreateTripDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Trip</DialogTitle>

      <DialogContent>{/* Form goes here */}</DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" disabled>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
