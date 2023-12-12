const express = require('express');
const router = express.Router();
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    //Ändrade från localhost till mariadb för att få det att funka i docker
    host: 'mariadb',
    user: 'vteam_user',
    password: 'P@ssw0rd',
    database: 'elcyckel',
    connectionLimit: 20,
    connectTimeout: 30000,
});

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};

// READ (GET) all stations
router.get('/', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const stations = await connection.query('SELECT * FROM stations');
        res.json(stations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving stations' });
    } finally {
        connection.release();
    }
});

// READ (GET) a station by station_id
router.get('/:station_id', async (req, res) => {
    const stationId = req.params.station_id;

    const connection = await pool.getConnection();
    try {
        const station = await connection.query('SELECT * FROM stations WHERE station_id = ?', [stationId]);
        if (station.length > 0) {
            res.json(station[0]);
        } else {
            res.status(404).json({ error: 'Station not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving station' });
    } finally {
        connection.release();
    }
});

// CREATE (POST) a new station
// router.post('/', isAuthenticated, async (req, res) => {
router.post('/', async (req, res) => {
    const newStation = req.body;

    const connection = await pool.getConnection();
    try {
        const result = await connection.query(
            'INSERT INTO stations (station_name, latitude, longitude, city_id) VALUES (?, ?, ?, ?)',
            [newStation.station_name, newStation.latitude, newStation.longitude, newStation.city_id]
        );
        const insertedId = Number(result.insertId);

        res.json({ message: 'Station created successfully', insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Error creating station', details: error.message });
    } finally {
        connection.release();
    }
});

// UPDATE (PUT) a station by station_id
// router.put('/:station_id', isAuthenticated, async (req, res) => {
router.put('/:station_id', async (req, res) => {
    const stationId = req.params.station_id;
    const updatedStation = req.body;

    const connection = await pool.getConnection();
    try {
        const { station_name, latitude, longitude, city_id } = updatedStation;

        const result = await connection.query(
            'UPDATE stations SET station_name = ?, latitude = ?, longitude = ?, city_id = ? WHERE station_id = ?',
            [station_name, latitude, longitude, city_id, stationId]
        );

        if (result.affectedRows > 0) {
            res.json({ message: 'Station updated successfully' });
        } else {
            res.status(404).json({ error: 'Station not found' });
        }
    } catch (error) {
        console.error('Error updating station:', error.message);
        res.status(500).json({ error: 'Error updating station', details: error.message });
    } finally {
        connection.release();
    }
});

// DELETE a station by station_id
// router.delete('/:station_id', isAuthenticated, async (req, res) => {
router.delete('/:station_id', async (req, res) => {
    const stationId = req.params.station_id;

    const connection = await pool.getConnection();
    try {
        const result = await connection.query('DELETE FROM stations WHERE station_id = ?', [stationId]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Station deleted successfully' });
        } else {
            res.status(404).json({ error: 'Station not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting station' });
    } finally {
        connection.release();
    }
});

module.exports = router;
