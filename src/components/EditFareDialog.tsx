import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Fare } from "@/types/tracker";

interface EditFareDialogProps {
  fare: Fare | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (fareId: string, newAmount: number) => void;
}

export function EditFareDialog({
  fare,
  open,
  onOpenChange,
  onSave,
}: EditFareDialogProps) {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (fare) {
      setAmount(fare.amount.toString());
    }
  }, [fare]);

  const handleSave = () => {
    if (!fare) return;
    const newAmount = parseFloat(amount);
    if (isNaN(newAmount) || newAmount <= 0) {
      alert("Please enter a valid positive number");
      return;
    }
    onSave(fare.id, newAmount);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Fare</DialogTitle>
          <DialogDescription>
            Update the fare amount for this trip.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Fare Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter fare amount"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
