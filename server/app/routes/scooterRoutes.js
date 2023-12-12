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

// READ (GET) all scooters
router.get('/', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const stations = await connection.query('SELECT * FROM scooters');
        res.json(stations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving scooter' });
    } finally {
        connection.release();
    }
});

// READ (GET) a scooter by scooter_id
router.get('/:scooter_id', async (req, res) => {
    const stationId = req.params.station_id;

    const connection = await pool.getConnection();
    try {
        const station = await connection.query('SELECT * FROM scooters WHERE scooter_id = ?', [stationId]);
        if (station.length > 0) {
            res.json(station[0]);
        } else {
            res.status(404).json({ error: 'Scooter not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving scooter' });
    } finally {
        connection.release();
    }
});

// CREATE (POST) a new scooter
// router.post('/', isAuthenticated, async (req, res) => {
router.post('/', async (req, res) => {
    const newScooter = req.body;

    const connection = await pool.getConnection();
    try {
        const result = await connection.query(
            'INSERT INTO scooters (latitude, longitude, serial_number, battery_level, city_id, station_id, scooter_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [newScooter.latitude, newScooter.longitude, newScooter.serial_number, newScooter.battery_level, newScooter.city_id, newScooter.station_id, newScooter.scooter_status]
        );
        const insertedId = Number(result.insertId);
        
        res.json({ message: 'Scooter created successfully', insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Error creating scooter', details: error.message });
    } finally {
        connection.release();
    }
});

// UPDATE (PUT) a scooter by scooter_id
// router.put('/:scooter_id', isAuthenticated, async (req, res) => {
router.put('/:scooter_id', async (req, res) => {
    const scooterId = req.params.scooter_id;
    const updatedScooter = req.body;

    const connection = await pool.getConnection();
    try {
        const { latitude, longitude, serial_number, battery_level, city_id, station_id, scooter_status } = updatedScooter;

        const result = await connection.query(
            'UPDATE scooters SET  latitude = ?, longitude = ?, serial_number = ?, battery_level =?, city_id =?, station_id=?, scooter_status=? WHERE scooter_id = ?',
            [ latitude, longitude, serial_number, battery_level, city_id, station_id, scooter_status, scooterId]
        );

        if (result.affectedRows > 0) {
            res.json({ message: 'Scooter updated successfully' });
        } else {
            res.status(404).json({ error: 'Scooter not found' });
        }
    } catch (error) {
        console.error('Error updating scooter:', error.message);
        res.status(500).json({ error: 'Error updating scooter', details: error.message });
    } finally {
        connection.release();
    }
});

// DELETE a station by scooter_id
// router.delete('/:scooter_id', isAuthenticated, async (req, res) => {
router.delete('/:scooter_id', async (req, res) => {
    const scooterId = req.params.scooter_id;

    const connection = await pool.getConnection();
    try {
        const result = await connection.query('DELETE FROM scooters WHERE scooter_id = ?', [scooterId]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Scooter deleted successfully' });
        } else {
            res.status(404).json({ error: 'Scooter not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting scooter' });
    } finally {
        connection.release();
    }
});

module.exports = router;