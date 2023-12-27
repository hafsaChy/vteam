// const request = require('supertest');
// const app = require('../../index'); // Replace with the path to your Express app file
// const chai = require('chai');
// const assert = chai.assert;
// const mariadb = require('mariadb');
// const testDbConfig = require('../test-db-config');

// describe('Station Routes', function () {
//     let testPool;

//     // Test database setup
//     before(async function () {
//         this.timeout(10000); // Set a timeout of 10 seconds
//         testPool = mariadb.createPool(testDbConfig);
//         const connection = await testPool.getConnection();
//         try {
//             // Create a 'stations' table for testing
//             await connection.query(`
//                 CREATE TABLE IF NOT EXISTS stations (
//                     station_id INT AUTO_INCREMENT PRIMARY KEY,
//                     station_name VARCHAR(255),
//                     latitude FLOAT,
//                     longitude FLOAT,
//                     city_id INT
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
//             // Clean up the 'stations' table after all tests
//             await connection.query('DROP TABLE IF EXISTS stations');
//         } finally {
//             connection.release();
//             // Close the database connection
//             await testPool.end();
//         }
//     });

//     // Test POST /stations
//     describe('POST /elcyckel/v1/stations', function () {
//         it('creates a new station and responds with success message', async function () {
//             const newStation = {
//                 station_name: 'Test Station',
//                 latitude: 40.7128,
//                 longitude: -74.0060,
//                 city_id: 1, // Assuming there's a city with ID 1 in the database
//             };

//             const res = await request(app)
//                 .post('/elcyckel/v1/stations')
//                 .send(newStation)
//                 .expect('Content-Type', /json/)
//                 .expect(200);

//             assert.equal(res.body.message, 'Station created successfully');
//             assert.isNumber(res.body.insertedId, 'Inserted ID should be a number');
//         });
//     });

//     // Test GET /stations
//     describe('GET /elcyckel/v1/stations', function () {
//         it('responds with JSON containing an array of stations', async function () {
//             const res = await request(app)
//                 .get('/elcyckel/v1/stations')
//                 .expect('Content-Type', /json/)
//                 .expect(200);

//             assert.isArray(res.body, 'Response body should be an array');
//         });
//     });

//     // Add more tests for other routes (GET /stations/:station_id, PUT /stations/:station_id, DELETE /stations/:station_id) following a similar structure.

//     // Test GET /stations/:station_id
//     describe('GET /elcyckel/v1/stations/:station_id', function () {
//         it('responds with JSON containing a single station', async function () {
//             // Assume there's a station with ID 1 in the database
//             const testStationId = 1;

//             const res = await request(app)
//                 .get(`/elcyckel/v1/stations/${testStationId}`)
//                 .expect('Content-Type', /json/)
//                 .expect(200);

//             assert.isObject(res.body, 'Response body should be an object');
//             assert.equal(res.body.station_id, testStationId, 'Station ID should match');
//         });
//     });

//     // Test PUT /stations/:station_id
//     describe('PUT /elcyckel/v1/stations/:station_id', function () {
//         it('updates a station and responds with success message', async function () {
//             // Assume there's a station with ID 1 in the database
//             const testStationId = 1;
//             const updatedStation = {
//                 station_name: 'Updated Station',
//                 latitude: 41.8781,
//                 longitude: -87.6298,
//                 city_id: 2, // Assuming there's a city with ID 2 in the database
//             };

//             const res = await request(app)
//                 .put(`/elcyckel/v1/stations/${testStationId}`)
//                 .send(updatedStation)
//                 .expect('Content-Type', /json/)
//                 .expect(200);

//             assert.equal(res.body.message, 'Station updated successfully');
//         });
//     });

//     // Test DELETE /stations/:station_id
//     describe('DELETE /elcyckel/v1/stations/:station_id', function () {
//         it('deletes a station and responds with success message', async function () {
//             // Assume there's a station with ID 1 in the database
//             const testStationId = 1;

//             const res = await request(app)
//                 .delete(`/elcyckel/v1/stations/${testStationId}`)
//                 .expect('Content-Type', /json/)
//                 .expect(200);

//             assert.equal(res.body.message, 'Station deleted successfully');
//         });
//     });
// });
