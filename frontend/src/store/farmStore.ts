import { create } from 'zustand';

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
  name: string;
  area: number;
  health: number;
  stage: string;
  plantedDate: string;
  expectedHarvest: string;
}

interface FarmState {
  farmerName: string;
  farmName: string;
  totalAcres: number;
  soilReports: SoilReport[];
  advisories: Advisory[];
  crops: CropData[];
  activePage: string;
  sidebarOpen: boolean;
  addSoilReport: (report: SoilReport) => void;
  updateSoilReport: (id: string, updates: Partial<SoilReport>) => void;
  markAdvisoryRead: (id: string) => void;
  setActivePage: (page: string) => void;
  toggleSidebar: () => void;
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
  {
    id: '3',
    title: 'Optimal Planting Window for Wheat',
    category: 'crop',
    severity: 'medium',
    date: '2025-01-13',
    summary: 'The optimal planting window for winter wheat is approaching. Prepare fields for sowing.',
    details: 'Based on soil temperature and moisture conditions, the ideal planting window for winter wheat varieties (HD-2967, PBW-343) is between January 20-February 5. Timely sowing can improve yields by 15-20%.',
    actionItems: ['Complete field preparation by Jan 18', 'Ensure seed treatment with fungicide', 'Apply basal dose of fertilizer', 'Maintain seed rate of 100-125 kg/ha'],
    isRead: true,
  },
  {
    id: '4',
    title: 'Soil pH Correction Needed - Field B',
    category: 'soil',
    severity: 'medium',
    date: '2025-01-12',
    summary: 'Recent soil test shows pH below optimal range. Lime application recommended.',
    details: 'Field B soil test results show pH of 5.2, which is below the optimal range of 6.0-7.0 for most crops. This acidic condition can reduce nutrient availability and affect crop growth.',
    actionItems: ['Apply agricultural lime at 2 tons/acre', 'Incorporate lime into top 6 inches of soil', 'Retest soil after 3 months', 'Consider growing acid-tolerant crops in interim'],
    isRead: true,
  },
  {
    id: '5',
    title: 'Corn Price Rally - Consider Forward Contracts',
    category: 'market',
    severity: 'low',
    date: '2025-01-11',
    summary: 'Corn futures have risen 12% this month. Consider locking in prices with forward contracts.',
    details: 'Global corn prices have been on an upward trend due to reduced production estimates from South America. Current prices are 12% above the 3-month average, presenting a good opportunity for forward selling.',
    actionItems: ['Review current corn inventory', 'Contact local grain buyer for forward contract rates', 'Consider selling 30-50% of expected production', 'Monitor price trends weekly'],
    isRead: false,
  },
];

const mockCrops: CropData[] = [
  { name: 'Corn (Maize)', area: 45, health: 87, stage: 'Tasseling', plantedDate: '2024-10-15', expectedHarvest: '2025-02-20' },
  { name: 'Winter Wheat', area: 30, health: 92, stage: 'Tillering', plantedDate: '2024-11-20', expectedHarvest: '2025-04-15' },
  { name: 'Soybeans', area: 25, health: 78, stage: 'Pod Fill', plantedDate: '2024-09-10', expectedHarvest: '2025-01-30' },
  { name: 'Rice (Paddy)', area: 20, health: 95, stage: 'Heading', plantedDate: '2024-10-01', expectedHarvest: '2025-02-10' },
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
      recommendations: [
        'Nitrogen levels are good. Maintain current fertilization schedule.',
        'Phosphorus is slightly low. Apply 20 kg/ha of single super phosphate.',
        'Potassium levels are adequate for most crops.',
        'Organic matter could be improved. Consider cover cropping or adding compost.',
      ],
    },
  },
  {
    id: 'sr-2',
    fileName: 'field_b_analysis.pdf',
    uploadDate: '2025-01-08',
    status: 'complete',
    results: {
      ph: 5.2,
      nitrogen: 180,
      phosphorus: 35,
      potassium: 140,
      organicMatter: 2.1,
      moisture: 22,
      texture: 'Sandy Loam',
      healthScore: 58,
      recommendations: [
        'Soil pH is too acidic. Apply agricultural lime at 2 tons/acre.',
        'Nitrogen is deficient. Increase urea application by 25%.',
        'Phosphorus levels are good.',
        'Organic matter is low. Add 5 tons/acre of farmyard manure.',
      ],
    },
  },
];

export const useFarmStore = create<FarmState>((set) => ({
  farmerName: 'Rajesh Kumar',
  farmName: 'Green Valley Farm',
  totalAcres: 120,
  soilReports: mockSoilReports,
  advisories: mockAdvisories,
  crops: mockCrops,
  activePage: 'dashboard',
  sidebarOpen: false,
  addSoilReport: (report) => set((state) => ({ soilReports: [report, ...state.soilReports] })),
  updateSoilReport: (id, updates) => set((state) => ({
    soilReports: state.soilReports.map((r) => r.id === id ? { ...r, ...updates } : r),
  })),
  markAdvisoryRead: (id) => set((state) => ({
    advisories: state.advisories.map((a) => a.id === id ? { ...a, isRead: true } : a),
  })),
  setActivePage: (page) => set({ activePage: page, sidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
