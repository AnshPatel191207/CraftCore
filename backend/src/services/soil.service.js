const { parseSoilText } = require('../utils/soilParser');

/**
 * Soil Health Scoring and Rule-Based Recommendations Logic
 * Acts as the fallback when AI is unavailable or in DEMO_MODE.
 */

const calculateHealthScore = (data) => {
    let score = 100;
    // CRITICAL: Ensure all values are Numbers to prevent NaN propagation
    const ph = Number(data.ph) || 7;
    const nitrogen = Number(data.nitrogen) || 0;
    const phosphorus = Number(data.phosphorus) || 0;
    const potassium = Number(data.potassium) || 0;
    const organicMatter = Number(data.organicMatter) || 0;

    // pH Penalty: Optimal 6-7.5
    if (ph < 5.5 || ph > 8.5) score -= 25;
    else if (ph < 6 || ph > 7.5) score -= 10;

    // Nutrient Penalties (Simplified)
    if (nitrogen < 250) score -= 15;
    if (phosphorus < 15) score -= 10;
    if (potassium < 120) score -= 10;
    if (organicMatter < 0.5) score -= 15;

    return Math.max(0, score);
};

const getRuleBasedAnalysis = (rawText) => {
    if (!rawText) return { 
        ph: 7, nitrogen: 280, phosphorus: 20, potassium: 150, organicMatter: 0.8, 
        texture: 'Loamy', healthScore: 90, 
        recommendations: ['Maintain soil organic matter'], 
        summary: 'Baseline soil health profile.' 
    };

    const parsed = parseSoilText(rawText);
    const healthScore = calculateHealthScore(parsed);

    const recs = [
      'Maintain seasonal soil testing cadence'
    ];
    if (healthScore < 80) recs.push('Apply organic manure to improve fertility');
    if (parsed.ph < 6) recs.push('Apply lime to neutralize high acidity');
    if (parsed.nitrogen < 200) recs.push('Use nitrogen-rich fertilizers like Urea');

    return {
        ...parsed,
        texture: parsed.ph < 6.5 ? 'Sandy Loam' : 'Loamy',
        healthScore,
        recommendations: recs,
        summary: `Soil health analyzed using baseline agronomic rules. pH is ${parsed.ph || 'unknown'} and Health Index is ${healthScore}%. Recommendations are tailored for current field parameters.`
    };
};

const getRuleBasedCropRecommendations = (soilData) => {
    const { ph, nitrogen } = soilData;
    let crops = ['Wheat', 'Maize', 'Gram', 'Soybean', 'Mustard'];

    if (ph < 6.5 && nitrogen > 200) {
        crops = ['Rice', 'Maize', 'Soybean', 'Groundnut', 'Sesame'];
    } else if (ph >= 6 && ph <= 7.5) {
        crops = ['Wheat', 'Mustard', 'Gram', 'Barley', 'Sunflower'];
    }

    return {
        recommendations: crops.map(name => ({
            cropName: name,
            suitabilityScore: 85,
            reason: 'Suitable for current soil pH and nutrient profile.',
            season: 'Rabi/Kharif',
            expectedYield: 'Medium-High',
            marketDemand: 'High'
        })),
        summary: 'Recommended crops based on pH and nutrient thresholds.'
    };
};

const getRuleBasedFertilizer = (soilData, cropName) => {
    const alerts = [];
    const { nitrogen, phosphorus, potassium, ph, organicMatter } = soilData;

    if (nitrogen < 280) alerts.push({ nutrient: 'Nitrogen', dosage: 'Apply Urea @ 60kg/acre' });
    if (phosphorus < 15) alerts.push({ nutrient: 'Phosphorus', dosage: 'Apply DAP @ 50kg/acre' });
    if (potassium < 120) alerts.push({ nutrient: 'Potassium', dosage: 'Apply MOP @ 40kg/acre' });
    if (organicMatter < 0.5) alerts.push({ nutrient: 'OC', dosage: 'Apply FYM @ 5 tonnes/acre' });

    return {
        deficiencies: alerts.map(a => ({ nutrient: a.nutrient, severity: 'medium' })),
        recommendations: alerts.map(a => ({
            fertilizerName: a.nutrient + ' Supplement',
            type: 'chemical',
            dosage: a.dosage,
            applicationMethod: 'Basal Dose',
            timing: 'Pre-sowing',
            estimatedCost: 'Moderate'
        })),
        sustainabilityTips: ['Use organic compost alongside chemical fertilizers'],
        summary: `Nutrient plan for ${cropName} based on available soil parameters.`
    };
};

module.exports = {
    calculateHealthScore,
    getRuleBasedAnalysis,
    getRuleBasedCropRecommendations,
    getRuleBasedFertilizer
};
