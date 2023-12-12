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
    connectTimeout: 60000,
});


// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};

// Protected route - check if the user is authenticated
router.get('/profile', isAuthenticated, (req, res) => {
    res.json({ message: 'Welcome to your profile', user: req.user });
});

// CREATE (POST) a new user
router.post('/', async (req, res) => {
    const newUser = req.body;

    const connection = await pool.getConnection();
    try {
        const { username, email, age, password, role } = newUser;

        const result = await connection.query(
            'INSERT INTO users (username, email, age, password, role) VALUES (?, ?, ?, ?, ?)',
            [username, email, age, password, role]
        );

        const insertedId = Number(result.insertId);

        res.json({ message: 'User created successfully', insertedId});
    } catch (error) {
        res.status(500).json({ error: 'Error creating user', details: error.message });
    } finally {
        connection.release();
    }
});

// READ (GET) all users
router.get('/', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const users = await connection.query('SELECT * FROM users');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving users', details: error.message });
    } finally {
        connection.release();
    }
});

// READ (GET) a user by user_id
router.get('/:user_id', async (req, res) => {
    const userId = req.params.user_id;

    const connection = await pool.getConnection();
    try {
        const user = await connection.query('SELECT * FROM users WHERE user_id = ?', [userId]);
        if (user.length > 0) {
            res.json(user[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving user' });
    } finally {
        connection.release();
    }
});

// UPDATE (PUT) a user by user_id
router.put('/:user_id', async (req, res) => {
    const userId = req.params.user_id;
    const updatedUser = req.body;

    const connection = await pool.getConnection();
    try {
        const { username, email, age, password, role } = updatedUser;

        // Explicitly set 'role' parameter for the UPDATE statement
        const result = await connection.query(
            'UPDATE users SET username = ?, email = ?, age = ?, password = ?, role = ? WHERE user_id = ?',
            [username, email, age, password, role, userId]
        );

        if (result.affectedRows > 0) {
            res.json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating user', details: error.message });
    } finally {
        connection.release();
    }
});


// DELETE a user by user_id
router.delete('/:user_id', async (req, res) => {
    const userId = req.params.user_id;

    const connection = await pool.getConnection();
    try {
        const result = await connection.query('DELETE FROM users WHERE user_id = ?', [userId]);
        if (result.affectedRows > 0) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting user' });
    } finally {
        connection.release();
    }
});

module.exports = router;

