import { create } from 'zustand';
import api from '../lib/axios';

export interface SoilReport {
  id: string;
  fileName: string;
  uploadDate: string;
  status: 'processing' | 'complete' | 'error';
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
  id?: string;
  name: string;
  area: number;
  health: number;
  stage: string;
  plantedDate: string;
  expectedHarvest: string;
}

export interface DashboardStats {
  cropHealth: number;
  activeArea: number;
  yieldEst: string;
  alerts: number;
}

interface FarmState {
  // Auth/User Context (Duplicated from useAuthStore for easy access in components if needed)
  farmerName: string;
  farmName: string;
  totalAcres: number;
  
  // App State
  isDemoMode: boolean;
  isLoading: boolean;
  
  // Data State
  soilReports: SoilReport[];
  advisories: Advisory[];
  crops: CropData[];
  stats: DashboardStats | null;
  activityFeed: { id: string; user: string; location: string; time: string; action: string }[];
  
  // Navigation/UI
  activePage: string;
  sidebarOpen: boolean;
  isPanelOpen: boolean;
  isCommandPaletteOpen: boolean;
  currentDomain: 'AgriTech' | 'FinTech' | 'Health' | 'EdTech' | 'Civic';
  
  // Actions
  setDemoMode: (enabled: boolean) => void;
  fetchDashboardData: () => Promise<void>;
  addSoilReport: (report: SoilReport) => void;
  updateSoilReport: (id: string, updates: Partial<SoilReport>) => void;
  markAdvisoryRead: (id: string) => void;
  setActivePage: (page: string) => void;
  toggleSidebar: () => void;
  setPanelOpen: (open: boolean) => void;
  togglePanel: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setDomain: (domain: 'AgriTech' | 'FinTech' | 'Health' | 'EdTech' | 'Civic') => void;
  addActivity: (activity: { user: string; location: string; action: string }) => void;
}

const mockAdvisories: Advisory[] = [
  {
    id: '1',
    title: 'Heavy Rainfall Expected This Week',
    category: 'weather',
    severity: 'high',
    date: '2025-01-15',
    summary: 'Heavy rainfall of 80-120mm expected over the next 3 days. Take preventive measures for standing crops.',
    details: 'A deep depression over the Bay of Bengal is expected to bring heavy rainfall across the region. Fields with poor drainage may experience waterlogging. Ensure proper drainage channels are clear and functional.',
    actionItems: ['Clear drainage channels immediately', 'Postpone any planned irrigation', 'Apply preventive fungicide on susceptible crops', 'Harvest mature crops if possible before rainfall'],
    isRead: false,
  },
  {
    id: '2',
    title: 'Fall Armyworm Alert - Corn Fields',
    category: 'pest',
    severity: 'critical',
    date: '2025-01-14',
    summary: 'Fall armyworm infestation reported in neighboring districts. Monitor corn fields closely.',
    details: 'Fall armyworm (Spodoptera frugiperda) has been detected in significant numbers in corn fields within a 50km radius. Early detection and management is critical to prevent crop losses exceeding 30%.',
    actionItems: ['Scout fields every 2-3 days for egg masses and larvae', 'Look for window-pane damage on leaves', 'Apply recommended insecticide if threshold exceeded', 'Use pheromone traps for monitoring'],
    isRead: false,
  },
];

const mockCrops: CropData[] = [
  { name: 'Corn (Maize)', area: 45, health: 87, stage: 'Tasseling', plantedDate: '2024-10-15', expectedHarvest: '2025-02-20' },
  { name: 'Winter Wheat', area: 30, health: 92, stage: 'Tillering', plantedDate: '2024-11-20', expectedHarvest: '2025-04-15' },
];

const mockSoilReports: SoilReport[] = [
  {
    id: 'sr-1',
    fileName: 'field_a_soil_test.pdf',
    uploadDate: '2025-01-10',
    status: 'complete',
    results: {
      ph: 6.8,
      nitrogen: 280,
      phosphorus: 22,
      potassium: 185,
      organicMatter: 3.2,
      moisture: 28,
      texture: 'Loamy',
      healthScore: 82,
      recommendations: ['Nitrogen levels are good.', 'Phosphorus is slightly low.'],
    },
  },
];

export const useFarmStore = create<FarmState>((set, get) => ({
  farmerName: 'Rajesh Kumar',
  farmName: 'Green Valley Farm',
  totalAcres: 120,
  
  isDemoMode: false,
  isLoading: false,
  
  soilReports: mockSoilReports,
  advisories: mockAdvisories,
  crops: mockCrops,
  stats: {
    cropHealth: 88,
    activeArea: 120,
    yieldEst: '4.5 t/ac',
    alerts: 2
  },
  
  activePage: 'dashboard',
  sidebarOpen: false,
  isPanelOpen: false,
  isCommandPaletteOpen: false,
  currentDomain: 'AgriTech',
  activityFeed: [
    { id: '1', user: 'Amit Patel', location: 'Ahmedabad, GJ', time: '2m ago', action: 'Uploaded soil report' },
    { id: '2', user: 'Suresh Raina', location: 'Meerut, UP', time: '5m ago', action: 'Requested crop advice' },
  ],

  setDemoMode: (enabled) => set({ isDemoMode: enabled }),

  fetchDashboardData: async () => {
    if (get().isDemoMode) return;
    
    set({ isLoading: true });
    try {
      const [statsRes, cropsRes, advisoriesRes, activityRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/crops'),
        api.get('/advisories'),
        api.get('/dashboard/activity-feed'),
      ]);
      
      set({
        stats: statsRes.data.data,
        crops: cropsRes.data.data,
        advisories: advisoriesRes.data.data,
        activityFeed: activityRes.data.data,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      set({ isLoading: false });
      // Fallback to demo mode if API fails
      // set({ isDemoMode: true }); 
    }
  },

  addSoilReport: (report) => set((state) => ({ soilReports: [report, ...state.soilReports] })),
  updateSoilReport: (id, updates) => set((state) => ({
    soilReports: state.soilReports.map((r) => r.id === id ? { ...r, ...updates } : r),
  })),
  markAdvisoryRead: async (id) => {
    try {
      await api.patch(`/advisories/${id}/read`);
      set((state) => ({
        advisories: state.advisories.map((a) => a.id === id ? { ...a, isRead: true } : a),
      }));
    } catch (err) {
      console.error('Failed to mark advisory as read:', err);
    }
  },
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
}));

