require('dotenv').config();
const { trainWithText } = require('../services/rag/ragChain');

/**
 * Curated knowledge base for AgriSense AI.
 */
const AGRI_KNOWLEDGE = [
  {
    title: "Soil Nitrogen Management",
    source: "Agricultural Advisory Board",
    content: `Nitrogen (N) is a critical nutrient for plant growth, particularly for leaf and stem development. 
    Common nitrogen fertilizers include Urea, Ammonium Nitrate, and Anhydrous Ammonia.
    For sustainable farming, use of organic nitrogen sources like manure and cover crops (legumes) is recommended.
    Deficiency Symptoms: Pale green or yellow leaves (chlorosis), stunted growth, and lower yields.`
  },
  {
    title: "Phosphorus and Potassium Balance",
    source: "Soil Science Institute",
    content: `Phosphorus (P) is essential for root development and flowering. Potassium (K) regulates water movement and disease resistance.
    Maintain a balanced N-P-K ratio based on soil test results.
    Over-application of phosphorus can lead to water pollution.
    Potassium deficiency often shows as "scorched" leaf edges.`
  },
  {
    title: "Optimal Soil pH for Crops",
    source: "Crop Resource Center",
    content: `Most agricultural crops prefer a soil pH between 6.0 and 7.5.
    If soil is too acidic (pH < 5.5), apply lime (calcium carbonate) to raise the pH.
    If soil is too alkaline (pH > 8.0), apply elemental sulfur or gypsum to lower the pH.
    Soil pH affects nutrient availability; for example, phosphorus becomes unavailable in highly acidic soils.`
  },
  {
    title: "Pest Management - Fall Armyworm",
    source: "Pest Control Division",
    content: `Fall Armyworm (Spodoptera frugiperda) is a major pest for corn, rice, and sorghum.
    Management strategies include early planting, crop rotation, and the use of pheromone traps.
    Biological controls like Neem oil or specialized Bt (Bacillus thuringiensis) sprays are effective and eco-friendly.
    Chemical control should be a last resort to protect beneficial insects.`
  },
  {
    title: "Water Conservation and Irrigation",
    source: "Water Management Dept",
    content: `Drip irrigation is the most efficient method for water conservation, delivering water directly to the root zone.
    Mulching helps retain soil moisture and suppress weeds.
    Scheduling irrigation based on soil moisture sensors or weather forecasts can reduce water waste by up to 40%.`
  }
];

async function seed() {
  console.log('🚀 Starting RAG Seeding process...');
  
  try {
    for (const item of AGRI_KNOWLEDGE) {
      console.log(`📝 Processing: ${item.title}...`);
      await trainWithText(item.content, { 
        source: item.source, 
        sourceId: item.title.toLowerCase().replace(/\s+/g, '_') 
      });
    }
    
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
