import { useState, useEffect, useCallback } from "react";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { CurrentShiftCard } from "@/components/CurrentShiftCard";
import { AddFareCard } from "@/components/AddFareCard";
import { SummaryCard } from "@/components/SummaryCard";
import { ShiftHistoryCard } from "@/components/ShiftHistoryCard";
import { EditFareDialog } from "@/components/EditFareDialog";
import { TrackerState, Fare, ShiftHistory } from "@/types/tracker";
import { exportToCSV } from "@/utils/exportUtils";
import { Sun, Moon, Car } from "lucide-react";
import { toast } from "sonner";

const LS_KEY = "taxi-tracker:v2";

function TaxiTrackerContent() {
  const { theme, setTheme } = useTheme();
  const [state, setState] = useState<TrackerState>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
    return {
      currentShift: null,
      history: [],
    };
  });

  const [fareInput, setFareInput] = useState("");
  const [nowSec, setNowSec] = useState(Math.floor(Date.now() / 1000));
  const [editingFare, setEditingFare] = useState<Fare | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state]);

  // Timer for elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setNowSec(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const startShift = useCallback(() => {
    if (state.currentShift) return;
    setState((s) => ({
      ...s,
      currentShift: { startTs: Date.now(), fares: [], trips: 0 },
    }));
    toast.success("Shift started!");
  }, [state.currentShift]);

  const startShiftCustom = useCallback(() => {
    const manual = prompt("Enter start time (YYYY-MM-DD HH:MM):");
    if (!manual) return;
    const parsed = new Date(manual);
    if (isNaN(parsed.getTime())) {
      alert("Could not parse that date. Use format: 2025-10-16 08:30");
      return;
    }
    setState((s) => ({
      ...s,
      currentShift: { startTs: parsed.getTime(), fares: [], trips: 0 },
    }));
    toast.success("Shift started with custom time!");
  }, []);

  const endShift = useCallback(() => {
    if (!state.currentShift) return;
    const endTs = Date.now();
    const startTs = state.currentShift.startTs;
    const seconds = Math.max(0, Math.round((endTs - startTs) / 1000));
    const earnings = state.currentShift.fares.reduce(
      (a, b) => a + b.amount,
      0
    );
    const trips = state.currentShift.trips;
    const shiftRecord: ShiftHistory = {
      id: `shift-${Date.now()}`,
      startTs,
      endTs,
      seconds,
      earnings,
      trips,
    };
    setState((s) => ({
      ...s,
      currentShift: null,
      history: [shiftRecord, ...s.history],
    }));
    toast.success(`Shift ended! Earned $${earnings.toFixed(2)}`);
  }, [state.currentShift]);

  const cancelShift = useCallback(() => {
    if (!confirm("Cancel current shift (not saved)?")) return;
    setState((s) => ({ ...s, currentShift: null }));
    toast.info("Shift cancelled");
  }, []);

  const addFare = useCallback(() => {
    if (!state.currentShift) {
      alert("Start a shift first");
      return;
    }
    if (!fareInput) return;
    const fare = Number(fareInput);
    if (isNaN(fare) || fare <= 0) {
      alert("Enter a valid positive number");
      return;
    }
    const newFare: Fare = {
      id: `fare-${Date.now()}`,
      amount: fare,
      timestamp: Date.now(),
    };
    setState((s) => {
      if (!s.currentShift) return s;
      return {
        ...s,
        currentShift: {
          ...s.currentShift,
          fares: [newFare, ...s.currentShift.fares], // Add to beginning
          trips: s.currentShift.trips + 1,
        },
      };
    });
    setFareInput("");
    toast.success(`Fare added: $${fare.toFixed(2)}`);
  }, [state.currentShift, fareInput]);

  const editFare = useCallback((fare: Fare) => {
    setEditingFare(fare);
    setEditDialogOpen(true);
  }, []);

  const saveFareEdit = useCallback(
    (fareId: string, newAmount: number) => {
      setState((s) => {
        if (!s.currentShift) return s;
        return {
          ...s,
          currentShift: {
            ...s.currentShift,
            fares: s.currentShift.fares.map((f) =>
              f.id === fareId ? { ...f, amount: newAmount } : f
            ),
          },
        };
      });
      toast.success("Fare updated!");
    },
    []
  );

  const deleteFare = useCallback((fareId: string) => {
    if (!confirm("Delete this fare?")) return;
    setState((s) => {
      if (!s.currentShift) return s;
      return {
        ...s,
        currentShift: {
          ...s.currentShift,
          fares: s.currentShift.fares.filter((f) => f.id !== fareId),
          trips: Math.max(0, s.currentShift.trips - 1),
        },
      };
    });
    toast.success("Fare deleted");
  }, []);

  const totalEarnings = useCallback(() => {
    if (!state.currentShift) return 0;
    return state.currentShift.fares.reduce((a, b) => a + b.amount, 0);
  }, [state.currentShift]);

  const elapsedSeconds = useCallback(() => {
    if (!state.currentShift) return 0;
    return Math.max(0, Math.round((nowSec * 1000 - state.currentShift.startTs) / 1000));
  }, [state.currentShift, nowSec]);

  const handleExportCSV = useCallback(() => {
    exportToCSV(state.history);
    toast.success("CSV exported successfully!");
  }, [state.history]);

  const clearHistory = useCallback(() => {
    if (!confirm("Clear all saved shifts? This cannot be undone.")) return;
    setState((s) => ({ ...s, history: [] }));
    toast.success("History cleared");
  }, []);

  const deleteShift = useCallback((id: string) => {
    if (!confirm("Delete this shift?")) return;
    setState((s) => ({
      ...s,
      history: s.history.filter((h) => h.id !== id),
    }));
    toast.success("Shift deleted");
  }, []);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        {/* Header */}
        <header className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Taxi Earnings Tracker</h1>
          </div>
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </header>

        {/* Current Shift */}
        <CurrentShiftCard
          currentShift={state.currentShift}
          elapsedSeconds={elapsedSeconds()}
          onStartShift={startShift}
          onStartShiftCustom={startShiftCustom}
          onEndShift={endShift}
          onCancelShift={cancelShift}
        />

        {/* Add Fare */}
        <AddFareCard
          fareInput={fareInput}
          onFareInputChange={setFareInput}
          onAddFare={addFare}
          disabled={!state.currentShift}
        />

        {/* Summary */}
        <SummaryCard
          currentShift={state.currentShift}
          totalEarnings={totalEarnings()}
          elapsedSeconds={elapsedSeconds()}
          onEditFare={editFare}
          onDeleteFare={deleteFare}
        />

        {/* Shift History */}
        <ShiftHistoryCard
          history={state.history}
          onExportCSV={handleExportCSV}
          onClearHistory={clearHistory}
          onDeleteShift={deleteShift}
        />

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground py-6">
          Data saved locally on this device. No accounts required.
        </footer>
      </div>

      {/* Edit Fare Dialog */}
      <EditFareDialog
        fare={editingFare}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={saveFareEdit}
      />
    </div>
  );
}

const Index = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <TaxiTrackerContent />
    </ThemeProvider>
  );
};

export default Index;
