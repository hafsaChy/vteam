//scooterRoutes.js
/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const mariadb = require('mariadb');
const dbConfig = require('./db-config');

const pool = mariadb.createPool(dbConfig);

// Middleware to check if the user is authenticated
// const isAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.status(401).json({ error: 'Unauthorized' });
// };

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
    const scooterId = req.params.scooter_id; 

    const connection = await pool.getConnection();
    try {
        const scooter = await connection.query('SELECT * FROM scooters WHERE scooter_id = ?', [scooterId]);
        if (scooter.length > 0) {
            res.json(scooter[0]);
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
        const { latitude, longitude ,battery_level ,scooter_status} = updatedScooter;

        const result = await connection.query(
            'UPDATE scooters SET latitude = ?, longitude = ?, battery_level = ? , scooter_status = ? WHERE scooter_id = ?',
            [latitude, longitude, battery_level, scooter_status , scooterId]
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
        await connection.query('DELETE FROM receipts WHERE scooter_id = ?', [scooterId]);
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
/* eslint-disable no-undef */
