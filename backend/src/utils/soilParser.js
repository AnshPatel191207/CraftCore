/**
 * Specialized regex-based parser for Indian soil laboratory reports.
 * Extracts N, P, K, pH, Organic Matter/Carbon, and Micronutrients.
 */
const parseSoilText = (rawText) => {
    const patterns = {
        nitrogen:      /(?:nitrogen|n)[:\s=-]+(\d+\.?\d*)/i,
        phosphorus:    /(?:phosphorus|p)[:\s=-]+(\d+\.?\d*)/i,
        potassium:     /(?:potassium|k)[:\s=-]+(\d+\.?\d*)/i,
        ph:            /(?:ph|reaction)[:\s=-]+(\d+\.?\d*)/i,
        organicMatter: /(?:organic\s*(?:matter|carbon)|oc|om)[:\s=-]+(\d+\.?\d*)/i,
        moisture:      /(?:moisture)[:\s=-]+(\d+\.?\d*)/i,
        zinc:          /(?:zinc|zn)[:\s=-]+(\d+\.?\d*)/i,
        iron:          /(?:iron|fe)[:\s=-]+(\d+\.?\d*)/i
    };

    const parsed = {};
    const micronutrients = {};

    for (const [key, regex] of Object.entries(patterns)) {
        const match = rawText.match(regex);
        const value = match ? parseFloat(match[1]) : null;

        if (['zinc', 'iron'].includes(key)) {
            micronutrients[key] = value;
        } else {
            parsed[key] = value;
        }
    }

    return {
        ...parsed,
        micronutrients
    };
};

module.exports = {
    parseSoilText
};
