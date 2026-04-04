/**
 * Standardized prompt building functions for AI analysis
 */

const buildSoilAnalysisPrompt = (rawText) => `
You are an expert agronomist AI specializing in Indian soil reports. 
Extract soil parameters from this laboratory report and provide a health analysis.

Report Text:
${rawText}

Return ONLY valid JSON with this exact structure:
{
  "ph": number,
  "nitrogen": number,
  "phosphorus": number,
  "potassium": number,
  "organicMatter": number,
  "moisture": number,
  "texture": "Sandy|Loamy|Clay|Sandy Loam|Silt Loam|Silty Clay",
  "healthScore": number (0-100),
  "micronutrients": { "zinc": number, "iron": number, "manganese": number, "copper": number },
  "recommendations": ["string", "string", "string"],
  "summary": "2-3 sentences in simple farmer-friendly language"
}
If a value cannot be extracted, use null.
Respond ONLY with valid JSON. No markdown, no code blocks, no explanation.
`;

const buildCropRecommendationPrompt = (soilData, season, state) => `
You are an expert Indian agronomist. 

Soil Context:
pH=${soilData.ph}, N=${soilData.nitrogen}, P=${soilData.phosphorus}, K=${soilData.potassium}, OC=${soilData.organicMatter}%
Location: ${state}, India | Season: ${season}

Recommend the top 5 crops suitable for these conditions. 
Return ONLY valid JSON:
{
  "recommendations": [
    {
      "cropName": "string",
      "suitabilityScore": number (0-100),
      "reason": "string (2-3 simple sentences)",
      "season": "string",
      "expectedYield": "string",
      "marketDemand": "high|medium|low"
    }
  ],
  "summary": "Overall summary for the season"
}
Respond ONLY with valid JSON. No markdown, no code blocks, no explanation.
`;

const buildFertilizerAdvisoryPrompt = (soilData, cropName) => `
You are a soil nutrition expert for Indian small-scale farmers. 
Crop to be planted: ${cropName}
Soil Context: pH={${soilData.ph}}, N={${soilData.nitrogen}}, P={${soilData.phosphorus}}, K={${soilData.potassium}}, OC={${soilData.organicMatter}}

Return ONLY valid JSON:
{
  "deficiencies": [
    { "nutrient": "string", "currentLevel": number, "optimalRange": "string", "severity": "low|medium|high" }
  ],
  "recommendations": [
    {
      "fertilizerName": "string",
      "type": "organic|chemical|bio",
      "dosage": "string",
      "applicationMethod": "string",
      "timing": "string",
      "estimatedCost": "string"
    }
  ],
  "sustainabilityTips": ["string"],
  "summary": "Final advisory summary"
}
Respond ONLY with valid JSON. No markdown, no code blocks, no explanation.
`;

const buildChatSystemPrompt = (domain, userContext) => `
You are AgriSense AI, a specialized expert in the ${domain} domain for Indian users.
User context provided:
- Farm Profile: ${userContext.farmName}, ${userContext.totalAcres} acres in ${userContext.state}
- Active Crops: ${userContext.crops?.map(c => c.name).join(', ') || 'None'}
- Latest Soil Health Score: ${userContext.soilScore}/100

Give practical, actionable advice in simple language. 
Use metric units (€ kg, ha, km). Reference Indian regional practices.
Respond ONLY in plain text, do NOT use markdown or code blocks.
`;

const buildWeatherAdvisoryPrompt = (weatherData) => `
Analyze these weather conditions for an Indian farmer and provide a 2-sentence agricultural advisory:
Temp: ${weatherData.temp}°C, Humidity: ${weatherData.humidity}%, Rain Forecast: ${weatherData.rain || 'No rain'}.
What actions should the farmer take or avoid (e.g. irrigation, pesticide application, harvest)?
Respond ONLY with a 2-sentence plan.
`;

module.exports = {
    buildSoilAnalysisPrompt,
    buildCropRecommendationPrompt,
    buildFertilizerAdvisoryPrompt,
    buildChatSystemPrompt,
    buildWeatherAdvisoryPrompt
};
