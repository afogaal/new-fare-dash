export interface Fare {
  id: string;
  amount: number;
  timestamp: number;
}

export interface CurrentShift {
  startTs: number;
  fares: Fare[];
  trips: number;
}

export interface ShiftHistory {
  id: string;
  startTs: number;
  endTs: number;
  seconds: number;
  earnings: number;
  trips: number;
}

export interface TrackerState {
  currentShift: CurrentShift | null;
  history: ShiftHistory[];
}
