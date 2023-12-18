const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'mariadb',
    user: 'vteam_user',
    password: 'P@ssw0rd',
    database: 'elcyckel',
    connectionLimit: 20,
    connectTimeout: 30000,
});

async function findUserByGitHubId(githubId) {
    const connection = await pool.getConnection();
    try {
        const user = await connection.query('SELECT * FROM users WHERE username = ?', [githubId]);
        return user[0] || null;
    } finally {
        connection.release();
    }
}

async function findUserById(user_id) {
    const connection = await pool.getConnection();
    try {
        const user = await connection.query('SELECT * FROM users WHERE user_id = ?', [user_id]);
        return user[0] || null;
    } finally {
        connection.release();
    }
}

async function createUser(newUser) {
    const connection = await pool.getConnection();
    try {
        const result = await connection.query(
            `INSERT INTO users (username, email, age, password, role) VALUES (?, ?, ?, ?, 'user')`,
            [newUser.username, newUser.email, newUser.age, newUser.password, newUser.role]
        );

        return { user_id: result.insertId, ...newUser };
    } finally {
        connection.release();
    }
}

module.exports = { findUserByGitHubId, findUserById, createUser };
