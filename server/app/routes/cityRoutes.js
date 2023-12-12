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

// check if it is needed
// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};

// READ (GET) all cities
router.get('/', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const cities = await connection.query('SELECT * FROM cities');
        res.json(cities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving cities' });
    } finally {
        connection.release();
    }
});

// READ (GET) a city by city_id
router.get('/:city_id', async (req, res) => {
    const cityId = req.params.city_id;

    const connection = await pool.getConnection();
    try {
        const city = await connection.query('SELECT * FROM cities WHERE city_id = ?', [cityId]);
        if (city.length > 0) {
            res.json(city[0]);
        } else {
            res.status(404).json({ error: 'City not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving city' });
    } finally {
        connection.release();
    }
});

// CREATE (POST) a new city
// router.post('/', isAuthenticated, async (req, res) => {
router.post('/', async (req, res) => {
    const newCity = req.body;

    const connection = await pool.getConnection();
    try {
        const result = await connection.query(
            'INSERT INTO cities (city_name) VALUES (?)',
            [newCity.city_name]
        );
        const insertedId = Number(result.insertId);

        res.json({ message: 'City created successfully', insertedId});
    } catch (error) {
        res.status(500).json({ error: 'Error creating city', details: error.message });
    } finally {
        connection.release();
    }
});

// UPDATE (PUT) a city by city_id
// router.put('/:city_id', isAuthenticated, async (req, res) => {
router.put('/:city_id', async (req, res) => {
    const cityId = req.params.city_id;
    const updatedCity = req.body;

    const connection = await pool.getConnection();
    try {
        const { city_name } = updatedCity;

        const result = await connection.query(
            'UPDATE cities SET city_name = ? WHERE city_id = ?',
            [city_name, cityId]
        );

        if (result.affectedRows > 0) {
            res.json({ message: 'City updated successfully' });
        } else {
            res.status(404).json({ error: 'City not found' });
        }
    } catch (error) {
        console.error('Error updating city:', error.message);
        res.status(500).json({ error: 'Error updating city', details: error.message });
    } finally {
        connection.release();
    }
});

// DELETE a city by city_id
// router.delete('/:city_id', isAuthenticated, async (req, res) => {
router.delete('/:city_id', async (req, res) => {
    const cityId = req.params.city_id;

    const connection = await pool.getConnection();
    try {
        const result = await connection.query('DELETE FROM cities WHERE city_id = ?', [cityId]);
        if (result.affectedRows > 0) {
            res.json({ message: 'City deleted successfully' });
        } else {
            res.status(404).json({ error: 'City not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting city' });
    } finally {
        connection.release();
    }
});

module.exports = router;
