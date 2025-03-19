const { addSchool, getAllSchools } = require('../models/schoolModel');
const geolib = require('geolib');

exports.addSchool = async (req, res) => {
    try {
        const { name, address, latitude, longitude } = req.body;
        
        if (!name || !address || !latitude || !longitude) {
            return res.status(400).json({ error: "All fields are required." });
        }

        await addSchool(name, address, parseFloat(latitude), parseFloat(longitude));
        res.status(201).json({ message: "School added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listSchools = async (req, res) => {
    try {
        const { userLat, userLon } = req.query;

        if (!userLat || !userLon) {
            return res.status(400).json({ error: "User's latitude and longitude are required." });
        }

        const schools = await getAllSchools();
        const userLocation = { latitude: parseFloat(userLat), longitude: parseFloat(userLon) };

        // Sort schools by distance
        const sortedSchools = schools.map(school => ({
            ...school,
            distance: geolib.getDistance(userLocation, { latitude: school.latitude, longitude: school.longitude })
        })).sort((a, b) => a.distance - b.distance);

        res.status(200).json(sortedSchools);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
