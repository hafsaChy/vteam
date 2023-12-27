// const request = require('supertest');
// const app = require('../../app/index');
// const chai = require('chai');
// const assert = chai.assert;
// const mariadb = require('mariadb');
// const testDbConfig = require('../test-db-config');

// describe('User Routes', function () {
//     let testPool;

//     // Test database setup
//     before(async function () {
//         this.timeout(10000); // Set a timeout of 10 seconds
//         testPool = mariadb.createPool(testDbConfig);
//         const connection = await testPool.getConnection();
//         try {
//             // Create a 'users' table for testing
//             await connection.query(`
//                 CREATE TABLE IF NOT EXISTS users (
//                     user_id INT AUTO_INCREMENT PRIMARY KEY,
//                     username VARCHAR(255),
//                     email VARCHAR(255),
//                     age INT,
//                     password VARCHAR(255),
//                     role VARCHAR(255)
//                 )
//             `);
//         } finally {
//             connection.release();
//         }
//     });

//     // Test database cleanup
//     after(async function () {
//         const connection = await testPool.getConnection();
//         try {
//             // Clean up the 'users' table after all tests
//             await connection.query('DROP TABLE IF EXISTS users');
//         } finally {
//             connection.release();
//             // Close the database connection
//             await testPool.end();
//         }
//     });

//     // Test POST /user
//     describe('POST /elcyckel/v1/users', function () {
//         it('creates a new user and responds with success message', async function () {
//             const newUser = {
//                 username: 'testuser',
//                 email: 'testuser@example.com',
//                 age: 25,
//                 password: 'testpassword',
//                 role: 'user',
//             };

//             const res = await request(app)
//                 .post('/elcyckel/v1/users')
//                 .send(newUser)
//                 .expect('Content-Type', /json/)
//                 .expect(200);

//             assert.equal(res.body.message, 'User created successfully');
//             assert.isNumber(res.body.insertedId, 'Inserted ID should be a number');
//         });
//     });

//     // Test GET /user
//     describe('GET /elcyckel/v1/users', function () {
//         it('responds with JSON containing an array of users', async function () {
//             const res = await request(app)
//                 .get('/elcyckel/v1/users')
//                 .expect('Content-Type', /json/)
//                 .expect(200);

//             assert.isArray(res.body, 'Response body should be an array');
//         });
//     });

//     // Test GET /user/:user_id
//     describe('GET /elcyckel/v1/users/:user_id', function () {
//         it('responds with JSON containing a single user', async function () {
//             // Assume there's a user with ID 1 in the database
//             const testUserId = 1;

//             const res = await request(app)
//                 .get(`/user/${testUserId}`)
//                 .expect('Content-Type', /json/)
//                 .expect(200);

//             assert.isObject(res.body, 'Response body should be an object');
//             assert.equal(res.body.user_id, testUserId, 'User ID should match');
//         });
//     });

//     // Test PUT /user/:user_id
//     describe('PUT /elcyckel/v1/users/:user_id', function () {
//         it('updates a user and responds with success message', async function () {
//             // Assume there's a user with ID 1 in the database
//             const testUserId = 1;
//             const updatedUser = {
//                 username: 'updateduser',
//                 email: 'updateduser@example.com',
//                 age: 30,
//                 password: 'updatedpassword',
//                 role: 'admin',
//             };

//             const res = await request(app)
//                 .put(`/elcyckel/v1/users/${testUserId}`)
//                 .send(updatedUser)
//                 .expect('Content-Type', /json/)
//                 .expect(200);

//             assert.equal(res.body.message, 'User updated successfully');
//         });
//     });

//     // Test DELETE /user/:user_id
//     describe('DELETE /elcyckel/v1/users/:user_id', function () {
//         it('deletes a user and responds with success message', async function () {
//             // Assume there's a user with ID 1 in the database
//             const testUserId = 1;

//             const res = await request(app)
//                 .delete(`/elcyckel/v1/user/${testUserId}`)
//                 .expect('Content-Type', /json/)
//                 .expect(200);

//             assert.equal(res.body.message, 'User deleted successfully');
//         });
//     });
// });
