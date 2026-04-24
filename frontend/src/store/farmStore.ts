import { create } from 'zustand';

export interface SoilReport {
  id?: string;
  _id?: string;
  fileName: string;
  uploadDate: string;
  status: 'uploaded' | 'analyzing' | 'done' | 'complete' | 'error';
  errorMessage?: string;
  rawData?: any;
  results?: {
    ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organicMatter: number;
    moisture: number;
    texture: string;
    healthScore: number;
    recommendations: string[];
    organicCarbon?: number;
  };
}

export interface Advisory {
  id: string;
  title: string;
  category: 'pest' | 'weather' | 'crop' | 'soil' | 'market';
  severity: 'low' | 'medium' | 'high' | 'critical';
  date: string;
  summary: string;
  details: string;
  actionItems: string[];
  isRead: boolean;
}

export interface CropData {
  name: string;
  area: number;
  health: number;
  stage: string;
  plantedDate: string;
  expectedHarvest: string;
}

interface FarmState {
  farmerName: string;
  avatar: string;
  farmName: string;
  totalAcres: number;
  soilReports: SoilReport[];
  selectedReportId: string | null;
  advisories: Advisory[];
  crops: CropData[];
  activePage: string;
  sidebarOpen: boolean;
  isPanelOpen: boolean;
  isCommandPaletteOpen: boolean;
  currentDomain: 'AgriTech' | 'FinTech' | 'Health' | 'EdTech' | 'Civic';
  activityFeed: { id: string; user: string; location: string; time: string; action: string }[];
  
  // Actions
  setFarmerName: (name: string) => void;
  setFarmData: (data: Partial<FarmState>) => void;
  updateCrops: (crops: CropData[]) => void;
  updateTotalAcres: (acres: number) => void;
  addSoilReport: (report: SoilReport) => void;
  setSoilReports: (reports: SoilReport[]) => void;
  updateSoilReport: (id: string, updates: Partial<SoilReport>) => void;
  deleteSoilReport: (id: string) => void;
  selectReport: (id: string | null) => void;
  markAdvisoryRead: (id: string) => void;
  setActivePage: (page: string) => void;
  toggleSidebar: () => void;
  setPanelOpen: (open: boolean) => void;
  togglePanel: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setDomain: (domain: 'AgriTech' | 'FinTech' | 'Health' | 'EdTech' | 'Civic') => void;
  addActivity: (activity: { user: string; location: string; action: string }) => void;
  pendingChatQuery: string | null;
  setPendingChatQuery: (query: string | null) => void;
  currentAdvisory: any;
  updateAdvisory: (data: any) => void;
  
  // Selectors
  getSelectedReport: () => SoilReport | null;
}

export const useFarmStore = create<FarmState>((set, get) => ({
  farmerName: JSON.parse(localStorage.getItem('user') || '{}').name || '',
  avatar: JSON.parse(localStorage.getItem('user') || '{}').avatar || '',
  farmName: JSON.parse(localStorage.getItem('user') || '{}').farmName || 'My Farm',
  totalAcres: JSON.parse(localStorage.getItem('user') || '{}').totalAcres || 0,
  soilReports: [], 
  selectedReportId: null,
  advisories: [], 
  crops: [
    { name: 'Corn (Maize)', area: 45, health: 87, stage: 'Tasseling', plantedDate: '2024-10-15', expectedHarvest: '2025-02-20' },
    { name: 'Winter Wheat', area: 30, health: 92, stage: 'Tillering', plantedDate: '2024-11-20', expectedHarvest: '2025-04-15' },
  ],
  activePage: 'dashboard',
  sidebarOpen: false,
  isPanelOpen: false,
  isCommandPaletteOpen: false,
  currentDomain: 'AgriTech',
  pendingChatQuery: null,
  activityFeed: [
    { id: '1', user: 'System', location: 'Cloud', time: '1m ago', action: 'System online' },
  ],
  
  getSelectedReport: () => {
    const { soilReports, selectedReportId } = get();
    if (!selectedReportId) return null;
    return soilReports.find(r => (r._id === selectedReportId || r.id === selectedReportId)) || null;
  },

  setFarmerName: (name: string) => set({ farmerName: name }),
  setFarmData: (data: Partial<FarmState>) => set((state) => ({ ...state, ...data })),

  addSoilReport: (report) => set((state) => ({ 
    soilReports: [report, ...state.soilReports] 
  })),
  
  updateCrops: (crops) => set({ crops }),
  updateTotalAcres: (acres) => set({ totalAcres: acres }),

  setSoilReports: (reports) => set({ soilReports: reports }),
  
  updateSoilReport: (id, updates) => set((state) => ({
    soilReports: state.soilReports.map((r) => (r._id === id || r.id === id) ? { ...r, ...updates } : r),
  })),

  deleteSoilReport: (id) => set((state) => ({
    soilReports: state.soilReports.filter((r) => r._id !== id && r.id !== id),
    selectedReportId: state.selectedReportId === id ? null : state.selectedReportId
  })),

  selectReport: (id) => set({ selectedReportId: id }),

  markAdvisoryRead: (id) => set((state) => ({
    advisories: state.advisories.map((a) => a.id === id ? { ...a, isRead: true } : a),
  })),
  
  setActivePage: (page) => set({ activePage: page, sidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setPanelOpen: (open) => set({ isPanelOpen: open }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  setDomain: (domain) => set({ currentDomain: domain }),
  addActivity: (activity) => set((state) => ({
    activityFeed: [{ id: Date.now().toString(), ...activity, time: 'Just now' }, ...state.activityFeed].slice(0, 5)
  })),
  setPendingChatQuery: (query) => set({ pendingChatQuery: query }),
  currentAdvisory: null,
  updateAdvisory: (data) => set({ currentAdvisory: data }),
}));
