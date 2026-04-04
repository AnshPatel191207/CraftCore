export interface SoilData {
  n: number;
  p: number;
  k: number;
  ph: number;
  oc: number;
  moisture: number;
}

export interface Imbalance {
  id: string;
  type: string;
  severity: 'low' | 'high' | 'optimal';
  impact: string;
  solution: string[];
}

export const analyzeSoilHealth = (data: SoilData) => {
  const issues: Imbalance[] = [];
  
  // Nitrogen
  if (data.n < 200) {
    issues.push({
      id: 'n-low',
      type: 'Nitrogen',
      severity: 'low',
      impact: 'lowN',
      solution: ['addCompost', 'applyFert', 'growLegumes']
    });
  }

  // pH
  if (data.ph < 6) {
    issues.push({
      id: 'ph-low',
      type: 'pH Level',
      severity: 'low',
      impact: 'highPH', // using existing key logic
      solution: ['addLime', 'organicMatter']
    });
  } else if (data.ph > 7.5) {
    issues.push({
      id: 'ph-high',
      type: 'pH Level',
      severity: 'high',
      impact: 'highPH',
      solution: ['addGypsum', 'organicMatter']
    });
  }

  // Organic Carbon
  if (data.oc < 0.5) {
    issues.push({
      id: 'oc-low',
      type: 'Organic Carbon',
      severity: 'low',
      impact: 'lowOC',
      solution: ['addCompost', 'cropRotation']
    });
  }

  // Health Score Calculation
  // Simplified logic: 100 base, subtract for each deviation
  let score = 100;
  if (data.n < 200) score -= 15;
  if (data.p < 20) score -= 10;
  if (data.k < 150) score -= 10;
  if (data.ph < 6 || data.ph > 7.5) score -= 15;
  if (data.oc < 0.5) score -= 20;
  if (data.moisture < 20) score -= 10;

  return {
    score: Math.max(0, score),
    issues
  };
};
