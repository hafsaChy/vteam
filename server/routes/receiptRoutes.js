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

module.exports = router;
