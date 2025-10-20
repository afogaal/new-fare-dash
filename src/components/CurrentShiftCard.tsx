import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrentShift } from "@/types/tracker";
import { formatTime, secondsToHMS } from "@/utils/timeUtils";
import { Clock } from "lucide-react";

interface CurrentShiftCardProps {
  currentShift: CurrentShift | null;
  elapsedSeconds: number;
  onStartShift: () => void;
  onStartShiftCustom: () => void;
  onEndShift: () => void;
  onCancelShift: () => void;
}

export function CurrentShiftCard({
  currentShift,
  elapsedSeconds,
  onStartShift,
  onStartShiftCustom,
  onEndShift,
  onCancelShift,
}: CurrentShiftCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Current Shift</CardTitle>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span className="font-medium">
              {currentShift ? "Running" : "Stopped"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {currentShift ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Started</div>
                <div className="text-sm font-medium">
                  {formatTime(currentShift.startTs)}
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Working</div>
                <div className="text-xl font-bold text-primary">
                  {secondsToHMS(elapsedSeconds)}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={onEndShift}
                variant="destructive"
                className="flex-1"
              >
                End Shift
              </Button>
              <Button onClick={onCancelShift} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              No active shift. Start now or pick a custom start time.
            </p>
            <div className="flex gap-2">
              <Button onClick={onStartShift} className="flex-1 bg-success hover:bg-success/90 text-success-foreground">
                Start Shift Now
              </Button>
              <Button onClick={onStartShiftCustom} variant="outline">
                Custom Start
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
