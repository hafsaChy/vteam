// stationRoutes.test.js
const request = require('supertest');
const app = require('../../index');
const chai = require('chai');
const assert = chai.assert;
const mariadb = require('mariadb');
const testDbConfig = require('../test-db-config');

//
describe('Station Routes', function () {
    let testPool;

    // Test database setup
    before(async function () {
        this.timeout(10000); // Set a timeout of 10 seconds
        testPool = mariadb.createPool(testDbConfig);
        const connection = await testPool.getConnection();
        try {
            // Create a 'stations' table for testing
            await connection.query(`
                CREATE TABLE stations (
                    station_id INT AUTO_INCREMENT PRIMARY KEY,
                    station_name VARCHAR(255),
                    latitude FLOAT,
                    longitude FLOAT,
                    city_id INT
                );
                INSERT INTO stations (station_name, latitude, longitude, city_id)
                VALUES 
                    ('A', 12.345678, -98.765432, 1),
                    ('B', 13.345678, -90.765432, 2);
            `);
        } finally {
            connection.release();
        }
    });

    // Test database cleanup
    after(async function () {
        const connection = await testPool.getConnection();
        try {
            this.timeout(15000); // Set a higher timeout (e.g., 15 seconds)
            const connection = await testPool.getConnection();
        
            await connection.query(`
                DROP TABLE IF EXISTS stations;
            `);
        } finally {
            connection.release();
            // Close the database connection
            await testPool.end();
        }
    });

    // Test POST /stations
    // describe('POST /elcyckel/v1/stations', function () {
    //     it('creates a new station and responds with success message', async function () {
    //         const testStationId = await getExistingStationId();;
    //         const newStation = {
    //             station_name: 'Test Station',
    //             latitude: 40.7128,
    //             longitude: -74.0060,
    //             city_id: testStationId
    //         };

    //         const res = await request(app)
    //             .post('/elcyckel/v1/stations')
    //             .send(newStation)
    //             .expect('Content-Type', /json/)
    //             .expect(200);

    //         assert.equal(res.body.message, 'Station created successfully');
    //         assert.isNumber(res.body.insertedId, 'Inserted ID should be a number');
    //     });
    // });

    // Test GET /stations
    describe('GET /elcyckel/v1/stations', function () {
        it('responds with JSON containing an array of stations', async function () {
            const res = await request(app)
                .get('/elcyckel/v1/stations')
                .expect('Content-Type', /json/)
                .expect(200);

            assert.isArray(res.body, 'Response body should be an array');
        });
    });


    // Test GET /stations/:station_id
    // describe('GET /elcyckel/v1/stations/:station_id', function () {
    //     it('responds with JSON containing a single station', async function () {
    //         // Assume there's a station with ID 1 in the database
    //         const testStationId = await getExistingStationId();;

    //         const res = await request(app)
    //             .get(`/elcyckel/v1/stations/${testStationId}`)
    //             .expect('Content-Type', /json/)
    //             .expect(200);

    //         assert.isObject(res.body, 'Response body should be an object');
    //         assert.equal(res.body.station_id, testStationId, 'Station ID should match');
    //     });
    // });

    // // Test PUT /stations/:station_id
    // describe('PUT /elcyckel/v1/stations/:station_id', function () {
    //     it('updates a station and responds with success message', async function () {
    //         const testCityId = await getExistingCityId();
    //         const testStationId = await getExistingStationId();;

    //         const updatedStation = {
    //             station_name: 'Updated Station',
    //             latitude: 41.8781,
    //             longitude: -87.6298,
    //             city_id: testCityId,
    //         };

    //         const res = await request(app)
    //             .put(`/elcyckel/v1/stations/${testStationId}`)
    //             .send(updatedStation)
    //             .expect('Content-Type', /json/)
    //             .expect(200);

    //         assert.equal(res.body.message, 'Station updated successfully');
    //     });
    // });

    // // Test DELETE /stations/:station_id
    // describe('DELETE /elcyckel/v1/stations/:station_id', function () {
    //     it('deletes a station and responds with success message', async function () {
    //         const testStationId = await getExistingStationId();;

    //         const res = await request(app)
    //             .delete(`/elcyckel/v1/stations/${testStationId}`)
    //             .expect('Content-Type', /json/)
    //             .expect(200);

    //         assert.equal(res.body.message, 'Station deleted successfully');
    //     });
    // });

    // Helper function to get an existing city_id from the database
    async function getExistingCityId() {
        const connection = await testPool.getConnection();
        try {
            const result = await connection.query('SELECT city_id FROM stations ORDER BY station_id DESC LIMIT 1');
            return result[0].city_id;
        } finally {
            connection.release();
        }
    }

    // Helper function to get an existing station_id from the database
    async function getExistingStationId() {
        const connection = await testPool.getConnection();
        try {
            const result = await connection.query('SELECT station_id FROM stations ORDER BY station_id DESC LIMIT 1');
            return result[0].station_id;
        } finally {
            connection.release();
        }
    }
});
