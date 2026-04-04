export type NutrientStatus = 'low' | 'optimal' | 'high';

export interface SoilValues {
  n: number; // Nitrogen
  p: number; // Phosphorus
  k: number; // Potassium
  ph: number;
  moisture: number;
  organicCarbon?: number;
}

export interface Recommendation {
  name: string;
  type: string;
  dosage: number;
  timing: string;
  color: string;
  reason: string;
}

export interface Deficiency {
  nutrient: string;
  impact: string;
  fix: string;
  severity: 'high' | 'medium' | 'low';
}

export interface FertilizerAdvisoryData {
  nutrients: { id: string; value: number; unit: string; status: NutrientStatus; color: string }[];
  deficiencies: Deficiency[];
  recommendations: Recommendation[];
  timeline: { day: number; label: string; icon: string; color: string }[];
  soilHealth: number;
}

const THRESHOLDS = {
  n: { low: 200, optimal: 300 },
  p: { low: 20, optimal: 40 },
  k: { low: 150, optimal: 250 },
};

export function analyzeSoil(data: SoilValues): FertilizerAdvisoryData {
  const nutrients = [
    { 
      id: 'nitrogen', 
      value: data.n, 
      unit: 'kg/ha', 
      status: (data.n < THRESHOLDS.n.low ? 'low' : data.n <= THRESHOLDS.n.optimal ? 'optimal' : 'high') as NutrientStatus,
      color: data.n < THRESHOLDS.n.low ? '#ef4444' : data.n <= THRESHOLDS.n.optimal ? '#22c55e' : '#3b82f6'
    },
    { 
      id: 'phosphorus', 
      value: data.p, 
      unit: 'kg/ha', 
      status: (data.p < THRESHOLDS.p.low ? 'low' : data.p <= THRESHOLDS.p.optimal ? 'optimal' : 'high') as NutrientStatus,
      color: data.p < THRESHOLDS.p.low ? '#ef4444' : data.p <= THRESHOLDS.p.optimal ? '#22c55e' : '#3b82f6'
    },
    { 
      id: 'potassium', 
      value: data.k, 
      unit: 'kg/ha', 
      status: (data.k < THRESHOLDS.k.low ? 'low' : data.k <= THRESHOLDS.k.optimal ? 'optimal' : 'high') as NutrientStatus,
      color: data.k < THRESHOLDS.k.low ? '#ef4444' : data.k <= THRESHOLDS.k.optimal ? '#22c55e' : '#3b82f6'
    },
    { 
      id: 'phLevel', 
      value: data.ph, 
      unit: 'pH', 
      status: (data.ph < 6 ? 'low' : data.ph <= 7.5 ? 'optimal' : 'high') as NutrientStatus,
      color: data.ph < 6 ? '#ef4444' : data.ph <= 7.5 ? '#22c55e' : '#3b82f6'
    },
    { 
      id: 'moisture', 
      value: data.moisture, 
      unit: '%', 
      status: (data.moisture < 20 ? 'low' : data.moisture <= 35 ? 'optimal' : 'high') as NutrientStatus,
      color: data.moisture < 20 ? '#ef4444' : data.moisture <= 35 ? '#3b82f6' : '#f59e0b'
    }
  ];

  const deficiencies: Deficiency[] = [];
  const recommendations: Recommendation[] = [];

  // Nitrogen Logic
  if (data.n < THRESHOLDS.n.low) {
    deficiencies.push({ nutrient: 'nitrogen', impact: 'impactLeaf', fix: 'fixUrea', severity: 'high' });
    recommendations.push({ 
      name: 'Urea', 
      type: 'Nitrogen-based', 
      dosage: 50, 
      timing: 'after20Days', 
      color: '#3b82f6',
      reason: 'Your soil needs more Nitrogen for better crop growth'
    });
  }

  // Phosphorus Logic
  if (data.p < THRESHOLDS.p.low) {
    deficiencies.push({ nutrient: 'phosphorus', impact: 'impactRoot', fix: 'fixDAP', severity: 'medium' });
    recommendations.push({ 
      name: 'DAP', 
      type: 'Phosphorus-based', 
      dosage: 40, 
      timing: 'beforeSowing', 
      color: '#22c55e',
      reason: 'Your soil needs Phosphorus for better root development'
    });
  }

  // Potassium Logic
  if (data.k < THRESHOLDS.k.low) {
    deficiencies.push({ nutrient: 'potassium', impact: 'Reduced disease resistance', fix: 'Potash', severity: 'low' });
    recommendations.push({ 
      name: 'Potash', 
      type: 'Potassium-based', 
      dosage: 30, 
      timing: 'after45Days', 
      color: '#f59e0b',
      reason: 'Your soil needs Potassium to strengthen your crops'
    });
  }

  // Calculate generic health score
  const score = Math.round(
    (Math.min(data.n / 300, 1) + Math.min(data.p / 40, 1) + Math.min(data.k / 250, 1)) / 3 * 100
  );

  return {
    nutrients,
    deficiencies,
    recommendations,
    timeline: [
      { day: 0, label: 'beforeSowing', icon: 'Beaker', color: '#22c55e' },
      { day: 20, label: 'after20Days', icon: 'Leaf', color: '#3b82f6' },
      { day: 45, label: 'after45Days', icon: 'TrendingUp', color: '#f59e0b' }
    ],
    soilHealth: score
  };
}
