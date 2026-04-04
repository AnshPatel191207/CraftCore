const axios = require('axios');

/**
 * Geocoding Service using OpenStreetMap Nominatim.
 * Converts city names to latitude and longitude.
 */

const getCoordinates = async (cityName) => {
    if (!cityName) return null;

    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`;
        
        // Nominatim requires a User-Agent header as per their usage policy
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'AgriSense-AI-Platform/1.0'
            }
        });

        if (response.data && response.data.length > 0) {
            const { lat, lon, display_name } = response.data[0];
            return {
                lat: parseFloat(lat),
                lng: parseFloat(lon),
                address: display_name
            };
        }

        return null;
    } catch (error) {
        console.error('Geocoding Error:', error.message);
        return null;
    }
};

module.exports = {
    getCoordinates
};
