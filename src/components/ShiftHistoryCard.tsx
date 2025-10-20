import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShiftHistory } from "@/types/tracker";
import { formatDate, formatTimeOnly } from "@/utils/timeUtils";
import { Download, Trash2, History } from "lucide-react";

interface ShiftHistoryCardProps {
  history: ShiftHistory[];
  onExportCSV: () => void;
  onClearHistory: () => void;
  onDeleteShift: (id: string) => void;
}

export function ShiftHistoryCard({
  history,
  onExportCSV,
  onClearHistory,
  onDeleteShift,
}: ShiftHistoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Shift History
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={onExportCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={onClearHistory} variant="outline" size="sm">
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8">
            No saved shifts yet. End a shift to save it here.
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((h) => (
              <div
                key={h.id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {formatDate(h.startTs)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeOnly(h.endTs)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{(h.seconds / 3600).toFixed(2)} hrs</span>
                      <span>•</span>
                      <span>{h.trips} trips</span>
                      <span>•</span>
                      <span className="font-semibold text-primary">
                        ${h.earnings.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteShift(h.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
