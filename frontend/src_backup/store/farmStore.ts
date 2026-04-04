import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/axios';


// ─── Interfaces ───────────────────────────────────────────────────────────────

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

export interface ActivityItem {
  id: string;
  user: string;
  location: string;
  time: string;
  action: string;
}

export type DomainKey = 'AgriTech' | 'FinTech' | 'Health' | 'EdTech' | 'Civic';


// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockAdvisories: Advisory[] = [
  {
    id: '1',
    title: 'Heavy Rainfall Expected This Week',
    category: 'weather',
    severity: 'high',
    date: '2025-01-15',
    summary: 'Heavy rainfall of 80–120 mm expected over the next 3 days. Take preventive measures for standing crops.',
    details: 'A deep depression over the Bay of Bengal is expected to bring heavy rainfall across the region. Fields with poor drainage may experience waterlogging. Ensure proper drainage channels are clear and functional.',
    actionItems: [
      'Clear drainage channels immediately',
      'Postpone any planned irrigation',
      'Apply preventive fungicide on susceptible crops',
      'Harvest mature crops if possible before rainfall',
    ],
    isRead: false,
  },
  {
    id: '2',
    title: 'Fall Armyworm Alert — Corn Fields',
    category: 'pest',
    severity: 'critical',
    date: '2025-01-14',
    summary: 'Fall armyworm infestation reported in neighboring districts. Monitor corn fields closely.',
    details: 'Fall armyworm (Spodoptera frugiperda) has been detected in significant numbers in corn fields within a 50 km radius. Early detection and management is critical to prevent crop losses exceeding 30%.',
    actionItems: [
      'Scout fields every 2–3 days for egg masses and larvae',
      'Look for window-pane damage on leaves',
      'Apply recommended insecticide if threshold exceeded',
      'Use pheromone traps for continuous monitoring',
    ],
    isRead: false,
  },
  {
    id: '3',
    title: 'Optimal Planting Window for Wheat',
    category: 'crop',
    severity: 'medium',
    date: '2025-01-13',
    summary: 'The optimal planting window for winter wheat is approaching. Prepare fields for sowing.',
    details: 'Based on soil temperature and moisture conditions, the ideal planting window for winter wheat varieties (HD-2967, PBW-343) is between January 20–February 5. Timely sowing can improve yields by 15–20%.',
    actionItems: [
      'Complete field preparation by Jan 18',
      'Ensure seed treatment with fungicide',
      'Apply basal dose of fertilizer before sowing',
      'Maintain seed rate of 100–125 kg/ha',
    ],
    isRead: true,
  },
  {
    id: '4',
    title: 'Soil pH Correction Needed — Field B',
    category: 'soil',
    severity: 'medium',
    date: '2025-01-12',
    summary: 'Recent soil test shows pH below optimal range. Lime application recommended.',
    details: 'Field B soil test results show pH of 5.2, which is below the optimal range of 6.0–7.0 for most crops. This acidic condition can reduce nutrient availability and affect crop growth.',
    actionItems: [
      'Apply agricultural lime at 2 tons/acre',
      'Incorporate lime into top 6 inches of soil',
      'Retest soil after 3 months',
      'Consider acid-tolerant crops in the interim',
    ],
    isRead: true,
  },
  {
    id: '5',
    title: 'Corn Price Rally — Consider Forward Contracts',
    category: 'market',
    severity: 'low',
    date: '2025-01-11',
    summary: 'Corn futures have risen 12% this month. Consider locking in prices with forward contracts.',
    details: 'Global corn prices have been on an upward trend due to reduced production estimates from South America. Current prices are 12% above the 3-month average, presenting a solid opportunity for forward selling.',
    actionItems: [
      'Review current corn inventory',
      'Contact local grain buyer for forward contract rates',
      'Consider selling 30–50% of expected production',
      'Monitor price trends weekly',
    ],
    isRead: false,
  },
];

const mockCrops: CropData[] = [
  { name: 'Corn (Maize)',  area: 45, health: 87, stage: 'Tasseling', plantedDate: '2024-10-15', expectedHarvest: '2025-02-20' },
  { name: 'Winter Wheat', area: 30, health: 92, stage: 'Tillering',  plantedDate: '2024-11-20', expectedHarvest: '2025-04-15' },
  { name: 'Soybeans',     area: 25, health: 78, stage: 'Pod Fill',   plantedDate: '2024-09-10', expectedHarvest: '2025-01-30' },
  { name: 'Rice (Paddy)', area: 20, health: 95, stage: 'Heading',    plantedDate: '2024-10-01', expectedHarvest: '2025-02-10' },
];

const mockSoilReports: SoilReport[] = [
  {
    id: 'sr-1',
    fileName: 'field_a_soil_test.pdf',
    uploadDate: '2025-01-10',
    status: 'complete',
    results: {
      ph: 6.8, nitrogen: 280, phosphorus: 22, potassium: 185,
      organicMatter: 3.2, moisture: 28, texture: 'Loamy', healthScore: 82,
      recommendations: [
        'Nitrogen levels are good. Maintain current fertilization schedule.',
        'Phosphorus is slightly low. Apply 20 kg/ha of single super phosphate.',
        'Potassium levels are adequate for most crops.',
        'Organic matter could be improved — consider cover cropping or adding compost.',
      ],
    },
  },
  {
    id: 'sr-2',
    fileName: 'field_b_analysis.pdf',
    uploadDate: '2025-01-08',
    status: 'complete',
    results: {
      ph: 5.2, nitrogen: 180, phosphorus: 35, potassium: 140,
      organicMatter: 2.1, moisture: 22, texture: 'Sandy Loam', healthScore: 58,
      recommendations: [
        'Soil pH is too acidic. Apply agricultural lime at 2 tons/acre.',
        'Nitrogen is deficient. Increase urea application by 25%.',
        'Phosphorus levels are good.',
        'Organic matter is low. Add 5 tons/acre of farmyard manure.',
      ],
    },
  },
];

const mockStats: DashboardStats = {
  cropHealth: 88,
  activeArea: 120,
  yieldEst: '4.5 t/ac',
  alerts: mockAdvisories.filter((a) => !a.isRead).length,
};

const mockActivityFeed: ActivityItem[] = [
  { id: '1', user: 'Amit Patel',     location: 'Ahmedabad, GJ', time: '2m ago',  action: 'Uploaded soil report'  },
  { id: '2', user: 'Suresh Raina',   location: 'Meerut, UP',    time: '5m ago',  action: 'Requested crop advice' },
  { id: '3', user: 'Priya Singh',    location: 'Patna, BR',     time: '8m ago',  action: 'Applied urea dosage'   },
  { id: '4', user: 'Venkatesh Iyer', location: 'Indore, MP',    time: '12m ago', action: 'Updated field health'  },
];


// ─── State Shape ──────────────────────────────────────────────────────────────

interface FarmState {
  // Identity
  farmerName: string;
  farmName: string;
  totalAcres: number;

  // App flags
  isDemoMode: boolean;
  isLoading: boolean;
  error: string | null;

  // Data
  soilReports: SoilReport[];
  advisories: Advisory[];
  crops: CropData[];
  stats: DashboardStats | null;
  activityFeed: ActivityItem[];

  // AI panel
  currentAdvisory: any | null;
  pendingChatQuery: string | null;
  chatHistory: Array<{ role: 'user' | 'bot'; text: string; time: string; sources?: string[] }>;
  isAiLoading: boolean;

  // UI
  sidebarOpen: boolean;
  isPanelOpen: boolean;
  isCommandPaletteOpen: boolean;
  currentDomain: DomainKey;

  // Actions — data
  setDemoMode: (enabled: boolean) => void;
  syncIdentity: (user: any) => void;
  fetchDashboardData: () => Promise<void>;
  addSoilReport: (report: SoilReport) => void;
  updateSoilReport: (id: string, updates: Partial<SoilReport>) => void;
  markAdvisoryRead: (id: string) => Promise<void>;
  updateAdvisory: (data: any) => void;
  addActivity: (activity: Omit<ActivityItem, 'id' | 'time'>) => void;

  // Actions — AI
  setPendingChatQuery: (query: string | null) => void;
  addChatMessage: (msg: { role: 'user' | 'bot'; text: string; sources?: string[] }) => void;
  clearChat: () => void;
  setAiLoading: (loading: boolean) => void;

  // Actions — UI
  toggleSidebar: () => void;
  setPanelOpen: (open: boolean) => void;
  togglePanel: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setDomain: (domain: DomainKey) => void;
}


// ─── Store ────────────────────────────────────────────────────────────────────

export const useFarmStore = create<FarmState>()(
  persist(
    (set, get) => ({

      // ── Identity ────────────────────────────────────────────────────────────
      farmerName: 'Rajesh Kumar',
      farmName:   'Green Valley Farm',
      totalAcres: 120,

      // ── Flags ───────────────────────────────────────────────────────────────
      isDemoMode: false,
      isLoading:  false,
      error:      null,

      // ── Data ────────────────────────────────────────────────────────────────
      soilReports:  [],
      advisories:   [],
      crops:        [],
      stats:        null,
      activityFeed: [],

      // ── AI panel ────────────────────────────────────────────────────────────
      currentAdvisory:  null,
      pendingChatQuery: null,
      chatHistory: [
        { role: 'bot', text: 'Hello! I\'m your KrishiSetu AI advisor. How can I help with your fields today?', time: '9:00 AM' },
      ],
      isAiLoading: false,

      // ── UI ──────────────────────────────────────────────────────────────────
      sidebarOpen:          false,
      isPanelOpen:          false,
      isCommandPaletteOpen: false,
      currentDomain:        'AgriTech',


      // ── Actions — data ──────────────────────────────────────────────────────

      setDemoMode: (enabled) => {
        set({
          isDemoMode:  enabled,
          soilReports: enabled ? mockSoilReports : [],
          advisories:  enabled ? mockAdvisories  : [],
          crops:       enabled ? mockCrops        : [],
          stats:       enabled ? mockStats        : null,
          error:       null,
        });
      },

      syncIdentity: (user) => {
        if (!user) return;
        set({
          farmerName: user.name || 'Rajesh Kumar',
          farmName:   user.farmName || 'Green Valley Farm',
          totalAcres: user.totalAcres || 0,
        });
      },

      fetchDashboardData: async () => {
        const { isDemoMode } = get();
        set({ isLoading: true, error: null });

        try {
          if (isDemoMode) {
            // Simulate network delay in demo mode (600ms as requested)
            await new Promise((res) => setTimeout(res, 600));
            set({
              crops:       mockCrops,
              advisories:  mockAdvisories,
              stats:       mockStats,
              activityFeed: mockActivityFeed,
              soilReports: mockSoilReports,
            });
          } else {
            // Live API calls in parallel
            const [cropsRes, advisoriesRes, statsRes, soilRes, activitiesRes] = await Promise.all([
              api.get('/crops'),
              api.get('/advisories'),
              api.get('/dashboard/stats'),
              api.get('/soil-reports'),
              api.get('/activities?limit=5')
            ]);

            // Map _id to id if necessary for SoilReport
            const mappedSoil = (soilRes.data.data || []).map((sr: any) => ({
              ...sr,
              id: sr._id || sr.id
            }));

            set({
              crops:       cropsRes.data.data      ?? [],
              advisories:  advisoriesRes.data.data ?? [],
              stats:       statsRes.data.data       ?? null,
              soilReports: mappedSoil,
              activityFeed: activitiesRes.data.data.map((a: any) => ({
                id: a._id || a.id,
                user: a.userId?.name || 'User',
                action: a.action,
                time: new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                location: a.location?.address || 'Field'
              })) ?? []
            });
          }
        } catch (err: any) {
          if (err?.response?.status === 429) {
            set({ error: 'System is busy (Too many requests). Please wait 1 minute.' });
          } else {
            const msg = err?.response?.data?.message ?? err?.message ?? 'Failed to load dashboard data.';
            set({ error: msg });
          }
          console.error('[fetchDashboardData]', err);
        } finally {
          set({ isLoading: false });
        }
      },

      addSoilReport: (report) =>
        set((state) => ({ soilReports: [report, ...state.soilReports] })),

      updateSoilReport: (id, updates) =>
        set((state) => ({
          soilReports: state.soilReports.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      markAdvisoryRead: async (id) => {
        // Optimistic update
        set((state) => ({
          advisories: state.advisories.map((a) =>
            a.id === id ? { ...a, isRead: true } : a
          ),
          stats: state.stats
            ? { ...state.stats, alerts: Math.max(0, state.stats.alerts - 1) }
            : null,
        }));

        if (!get().isDemoMode) {
          try {
            await api.patch(`/advisories/${id}/read`);
          } catch (err) {
            // Roll back on failure
            set((state) => ({
              advisories: state.advisories.map((a) =>
                a.id === id ? { ...a, isRead: false } : a
              ),
              stats: state.stats
                ? { ...state.stats, alerts: state.stats.alerts + 1 }
                : null,
            }));
            console.error('[markAdvisoryRead] rollback triggered:', err);
          }
        }
      },

      updateAdvisory: (data) => set({ currentAdvisory: data }),

      addActivity: (activity) =>
        set((state) => ({
          activityFeed: [
            { id: Date.now().toString(), time: 'Just now', ...activity },
            ...state.activityFeed,
          ].slice(0, 5),
        })),


      // ── Actions — AI ────────────────────────────────────────────────────────

      setPendingChatQuery: (query) => set({ pendingChatQuery: query }),

      addChatMessage: (msg) =>
        set((state) => ({
          chatHistory: [
            ...state.chatHistory,
            { ...msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          ],
        })),

      clearChat: () =>
        set({
          chatHistory: [
            { role: 'bot', text: 'Hello! I\'m your KrishiSetu AI advisor. How can I help with your fields today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          ],
        }),

      setAiLoading: (loading) => set({ isAiLoading: loading }),


      // ── Actions — UI ────────────────────────────────────────────────────────

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setPanelOpen:  (open) => set({ isPanelOpen: open }),
      togglePanel:   () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
      setCommandPaletteOpen:  (open) => set({ isCommandPaletteOpen: open }),
      toggleCommandPalette:   () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
      setDomain: (domain) => set({ currentDomain: domain }),
    }),

    {
      name: 'farm-store',
      // Only persist UI preferences and mode — never raw data (fetched fresh on load)
      partialize: (state: FarmState) => ({
        isDemoMode:    state.isDemoMode,
        currentDomain: state.currentDomain,
        farmerName:    state.farmerName,
        farmName:      state.farmName,
        totalAcres:    state.totalAcres,
      }),
    }
  )
);


// ─── Selector Hooks ───────────────────────────────────────────────────────────
// Fine-grained selectors prevent unnecessary re-renders in consumers.

export const useIsDemo    = ()  => useFarmStore((s) => s.isDemoMode);
export const useIsLoading = ()  => useFarmStore((s) => s.isLoading);
export const useStoreError = () => useFarmStore((s) => s.error);
export const useDomain     = () => useFarmStore((s) => s.currentDomain);

export const useCrops      = () => useFarmStore((s) => s.crops);
export const useAdvisories = () => useFarmStore((s) => s.advisories);
export const useSoilReports = () => useFarmStore((s) => s.soilReports);
export const useDashboardStats = () => useFarmStore((s) => s.stats);
export const useActivityFeed   = () => useFarmStore((s) => s.activityFeed);

// Derived — unread advisory count, recomputed only when advisories change
export const useUnreadCount = () =>
  useFarmStore((s) => s.advisories.filter((a) => !a.isRead).length);

// Derived — average crop health across all crops
export const useAvgCropHealth = () =>
  useFarmStore((s) =>
    s.crops.length > 0
      ? Math.round(s.crops.reduce((acc, c) => acc + c.health, 0) / s.crops.length)
      : 0
  );

// Derived — critical advisories only
export const useCriticalAdvisories = () =>
  useFarmStore((s) => s.advisories.filter((a) => a.severity === 'critical' && !a.isRead));