const Advisory = require('../models/Advisory');
const User = require('../models/User');
const { getIO } = require('../config/socket');

/**
 * Advisory Service for generating automated farming alerts.
 */

const generateAdvisoryFromSoilReport = async (soilReport, userId) => {
    const { results, _id: reportId } = soilReport;
    const advisories = [];

    // Critical Parameter Checks
    if (results.ph < 5.5) {
        advisories.push({
            title: 'Critical Soil Acidity Alert',
            category: 'soil',
            severity: 'high',
            summary: 'Your soil pH is below 5.5, indicating high acidity.',
            details: 'Highly acidic soil can severely limit nutrient availability and crop growth.',
            actionItems: ['Apply agricultural lime as recommended', 'Avoid ammonium-based fertilizers', 'Retest in 3 months']
        });
    }

    if (results.nitrogen < 200) {
        advisories.push({
            title: 'Low Nitrogen Warning',
            category: 'soil',
            severity: 'medium',
            summary: 'Nitrogen levels are below the optimal range for sustained growth.',
            details: 'Insufficient nitrogen will lead to stunted growth and reduced yields.',
            actionItems: ['Apply Urea or Neem-coated Urea', 'Plant nitrogen-fixing cover crops like legumes']
        });
    }

    // Save and Notify
    for (const data of advisories) {
        const advisory = await Advisory.create({
            ...data,
            userId,
            relatedReportId: reportId,
            source: 'ai'
        });

        // Emit Socket Event
        try {
            const io = getIO();
            io.to(`farm:${userId}`).emit('advisory:new', advisory);
        } catch (_) {}
    }

    return advisories;
};

const generateDailyAdvisories = async () => {
    // 1. Find unique user locations (states)
    const activeStates = await User.distinct('location.state', { 'location.state': { $exists: true } });

    for (const state of activeStates) {
        // 2. Generate a generic weather/pest alert for the state (Global)
        const advisory = await Advisory.create({
            title: `Regional Alert: ${state}`,
            category: 'weather',
            severity: 'medium',
            summary: `Seasonal weather pattern alert for ${state} farmers.`,
            details: 'Forecast indicates high humidity which may increase fungal risk.',
            actionItems: ['Monitor crops for fungal signs', 'Check irrigation schedules'],
            isGlobal: true,
            targetLocation: { state },
            source: 'system'
        });

        // 3. Emit to state-specific room
        try {
            const io = getIO();
            io.to(`location:${state}`).emit('advisory:new', advisory);
        } catch (_) {}
    }
};

module.exports = {
    generateAdvisoryFromSoilReport,
    generateDailyAdvisories
};
