// receiptRoutes.js
const express = require('express');
const router = express.Router();
const mariadb = require('mariadb');
const dbConfig = require('./db-config');

const pool = mariadb.createPool(dbConfig);

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};

// READ (GET) all receipts
router.get('/', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const receipts = await connection.query('SELECT * FROM receipts');
        res.json(receipts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving receipts' });
    } finally {
        connection.release();
    }
});

router.post('/', async (req, res) => {
    const newReceipt = req.body;

    const connection = await pool.getConnection();
    try {
        const result = await connection.query(
            'INSERT INTO receipts (user_id, scooter_id, amount, start_time, end_time, distance_in_km) VALUES (?, ?, ?, ?, ?, ?)',
            [newReceipt.user_id, newReceipt.scooter_id, newReceipt.amount, newReceipt.start_time, newReceipt.end_time, newReceipt.distance_in_km]
        );
        const insertedId = Number(result.insertId);

        res.json({ message: 'Receipt created successfully', insertedId });
    } catch (error) {
        console.error(error);  // Log the error
        res.status(500).json({ error: 'Error creating receipt', details: error.message });
    } finally {
        connection.release();
    }
});


module.exports = router;
