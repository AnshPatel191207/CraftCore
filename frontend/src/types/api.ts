export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  farmName: string;
  totalAcres: number;
  location: {
    address?: string;
    lat?: number;
    lng?: number;
    state?: string;
    district?: string;
    city?: string;
  };
  currentDomain: 'AgriTech' | 'FinTech' | 'Health' | 'EdTech' | 'Civic';
  role: 'farmer' | 'admin';
}

export interface SoilReport {
  _id: string;
  fileName: string;
  fileUrl: string;
  status: 'processing' | 'complete' | 'error';
  results: {
    ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organicMatter: number;
    healthScore: number;
    recommendations: string[];
    micronutrients: {
      zinc: number; iron: number;
      manganese: number; copper: number;
    };
  };
  createdAt: string;
}

export interface Crop {
  _id: string;
  name: string;
  area: number;
  health: number;
  stage: string;
  plantedDate: string;
  expectedHarvest: string;
  variety?: string;
  isActive: boolean;
}

export interface Advisory {
  _id: string;
  title: string;
  category: 'pest' | 'weather' | 'crop' | 'soil' | 'market';
  severity: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  details: string;
  actionItems: string[];
  isRead: boolean;
  date: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  sources?: string[];
}
