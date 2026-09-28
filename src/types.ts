export interface Manager {
  name: string;
  department: string;
  startCol: number;
}

export interface DailyData {
  date: string;
  managers: {
    [managerName: string]: {
      purchased: number;
      ordered: number;
      successful: number;
      cancelled: number;
    };
  };
}

export interface Totals {
  totalPlan: number;
  totalFact: number;
  totalPercent: number;
  totalSuccessful: number;
  avgCheck: number;
}

export interface ManagerPlan {
  name: string;
  department: string;
  plan: number;
  fact: number;
  percent: number;
  successful: number;
  avgCheck: number;
}

export interface ParsedData {
  managers: Manager[];
  dailyData: DailyData[];
  totals: Totals;
  plans: ManagerPlan[];
  rawRowCount: number;
  parseLog: string[];
}

export interface FilterState {
  department: string;
  selectedManagers: string[];
}
