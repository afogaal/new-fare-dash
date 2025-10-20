import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddFareCardProps {
  fareInput: string;
  onFareInputChange: (value: string) => void;
  onAddFare: () => void;
  disabled: boolean;
}

export function AddFareCard({
  fareInput,
  onFareInputChange,
  onAddFare,
  disabled,
}: AddFareCardProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      onAddFare();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Fare</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            value={fareInput}
            onChange={(e) => onFareInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Fare amount"
            type="number"
            min="0"
            step="0.01"
            className="flex-1"
            disabled={disabled}
          />
          <Button
            onClick={onAddFare}
            disabled={disabled}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
