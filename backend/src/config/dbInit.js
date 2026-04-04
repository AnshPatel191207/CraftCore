const mongoose = require('mongoose');
const User = require('../models/User');
const Advisory = require('../models/Advisory');
const Crop = require('../models/Crop');
const SoilReport = require('../models/SoilReport');

const seedData = async () => {
    try {
        // 1. Seed Default User if none exists
        const userCount = await User.countDocuments();
        let defaultUser;
        if (userCount === 0) {
            console.log('Seeding default user...');
            defaultUser = await User.create({
                name: 'Rajesh Kumar',
                email: 'test@example.com',
                password: 'password123', // Will be hashed by pre-save hook
                farmName: 'Green Valley Farm',
                totalAcres: 120,
                role: 'farmer'
            });
        } else {
            defaultUser = await User.findOne();
        }

        // 2. Seed Advisories if empty
        const advisoryCount = await Advisory.countDocuments();
        if (advisoryCount === 0) {
            console.log('Seeding mock advisories...');
            await Advisory.insertMany([
                {
                    userId: defaultUser._id,
                    title: 'Heavy Rainfall Expected This Week',
                    category: 'weather',
                    severity: 'high',
                    summary: 'Heavy rainfall of 80–120 mm expected over the next 3 days.',
                    details: 'A deep depression over the Bay of Bengal is expected to bring heavy rainfall. Fields with poor drainage may experience waterlogging.',
                    actionItems: ['Clear drainage channels', 'Postpone irrigation'],
                    isRead: false,
                    isGlobal: true
                },
                {
                    userId: defaultUser._id,
                    title: 'Fall Armyworm Alert',
                    category: 'pest',
                    severity: 'critical',
                    summary: 'Fall armyworm infestation reported in neighboring districts.',
                    details: 'Early detection is critical to prevent crop losses exceeding 30%.',
                    actionItems: ['Scout fields every 2-3 days', 'Look for window-pane damage'],
                    isRead: false,
                    isGlobal: true
                }
            ]);
        }

        // 3. Seed Crops if empty
        const cropCount = await Crop.countDocuments();
        if (cropCount === 0) {
            console.log('Seeding mock crops...');
            await Crop.insertMany([
                {
                    userId: defaultUser._id,
                    name: 'Corn (Maize)',
                    area: 45,
                    health: 87,
                    stage: 'Tasseling',
                    plantedDate: new Date('2024-10-15'),
                    expectedHarvest: new Date('2025-02-20')
                },
                {
                    userId: defaultUser._id,
                    name: 'Winter Wheat',
                    area: 30,
                    health: 92,
                    stage: 'Tillering',
                    plantedDate: new Date('2024-11-20'),
                    expectedHarvest: new Date('2025-04-15')
                }
            ]);
        }

        // 4. Seed Soil Reports if empty
        const soilCount = await SoilReport.countDocuments();
        if (soilCount === 0) {
            console.log('Seeding mock soil reports...');
            await SoilReport.insertMany([
                {
                    userId: defaultUser._id,
                    fileName: 'field_a_soil_test.pdf',
                    uploadDate: new Date('2025-01-10'),
                    status: 'complete',
                    results: {
                        ph: 6.8, nitrogen: 280, phosphorus: 22, potassium: 185,
                        organicMatter: 3.2, moisture: 28, texture: 'Loamy', healthScore: 82,
                        recommendations: [
                            'Nitrogen levels are good.',
                            'Phosphorus is slightly low.',
                            'Organic matter could be improved.'
                        ]
                    }
                }
            ]);
        }

        console.log('Database initialization complete.');
    } catch (error) {
        console.error('Database seeding failed:', error);
    }
};

module.exports = seedData;
