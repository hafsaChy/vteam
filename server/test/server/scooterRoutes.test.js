// test/scooterRoutes.test.js
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const request = require('supertest');
const app = require('../../index');
const chai = require('chai');
const assert = chai.assert;
const mariadb = require('mariadb');
const testDbConfig = require('../test-db-config');

describe('Scooter Routes', function () {
    let testPool;

    // Test database setup
    before(async function () {
        this.timeout(10000);
        testPool = mariadb.createPool(testDbConfig);
        const connection = await testPool.getConnection();

        try {
            await connection.query(`
                CREATE TABLE IF NOT EXISTS scooters (
                    scooter_id INT AUTO_INCREMENT,
                    latitude DECIMAL(12, 9),
                    longitude DECIMAL(12, 9),
                    serial_number VARCHAR(50) NOT NULL,
                    battery_level INT,
                    city_id INT,
                    station_id INT,
                    scooter_status varchar(50),
                    PRIMARY KEY (scooter_id)
                );                
                `);               
        } finally {
            connection.release();
        }
    });
     // Test database cleanup
    //  after(async function () {
    //     let connection; // Declare the connection variable outside the try block
    //     try {
    //         this.timeout(15000); // Set a higher timeout (e.g., 15 seconds)
    //         connection = await testPool.getConnection();
    
    //         await connection.query(`
    //             DELETE FROM scooters WHERE scooter_id = 'New City1'; //
    //         `);
    //     } finally {
    //         if (connection) {
    //             connection.release();
    //             // Close the database connection
    //             await testPool.end();
    //         }
    //     }
    // });

    after(async function () {
        const connection = await testPool.getConnection();
        await connection.rollback(); // Rollback the changes
        connection.release();
    });
    
    

    // Test GET /scooters
    describe('GET /elcyckel/v1/scooters', function () {
        it('responds with JSON containing an array of scooters', async function () {
            const res = await request(app)
                .get('/elcyckel/v1/scooters')
                .expect('Content-Type', /json/)
                .expect(200);

            assert.isArray(res.body, 'Response body should be an array');
        });
    });

    // Test GET /scooters/:scooter_id
    // describe('GET /elcyckel/v1/scooters/:scooter_id', function () {
    //     it('responds with JSON containing a single scooter', async function () {
    //         const testScooterId = await getExistingScooterId();

    //         const res = await request(app)
    //             .get(`/elcyckel/v1/scooters/${testScooterId}`)
    //             .expect('Content-Type', /json/)
    //             .expect(200);

    //         assert.isObject(res.body, 'Response body should be an object');
    //         assert.equal(res.body.scooter_id, testScooterId, 'Scooter ID should match');
    //     });

    //     it('responds with 404 for non-existent scooter', async function () {
    //         const nonExistentScooterId = 999;

    //         await request(app)
    //             .get(`/elcyckel/v1/scooters/${nonExistentScooterId}`)
    //             .expect('Content-Type', /json/)
    //             .expect(404);
    //     });
    // });

    // Test POST /scooters
    // describe('POST /elcyckel/v1/scooters', function () {
    //     it('creates a new scooter and responds with success message', async function () {
    //         const testCityId = await getExistingCityId();
    //         const testStationId = await getExistingStationId();

    //         const newScooter = {
    //             latitude: 123,
    //             longitude: 456,
    //             serial_number: 'ABC123',
    //             battery_level: 80,
    //             city_id: testCityId,
    //             station_id: testStationId,
    //             scooter_status: 'Active'
    //         };

    //         const res = await request(app)
    //             .post('/elcyckel/v1/scooters')
    //             .send(newScooter)
    //             .expect('Content-Type', /json/)
    //             .expect(200);

    //         assert.equal(res.body.message, 'Scooter created successfully');
    //         assert.isNumber(res.body.insertedId, 'Inserted ID should be a number');
    //     });
    // });

    // Test PUT /scooters/:scooter_id
    describe('PUT /elcyckel/v1/scooters/:scooter_id', function () {
        it('updates a scooter and responds with success message', async function () {
            const testCityId = await getExistingCityId();
            const testStationId = await getExistingStationId();
            const testScooterId = await getExistingScooterId();
            const updatedScooter = {
                latitude: 456,
                longitude: 789,
                serial_number: 'XYZ789',
                battery_level: 90,
                city_id: testCityId,
                station_id: testStationId,
                scooter_status: 'Inactive'
            };

            const res = await request(app)
                .put(`/elcyckel/v1/scooters/${testScooterId}`)
                .send(updatedScooter)
                .expect('Content-Type', /json/)
                .expect(200);

            assert.equal(res.body.message, 'Scooter updated successfully');
        });

        it('responds with 404 for updating non-existent scooter', async function () {
            const nonExistentScooterId = 1002;
            const updatedScooter = {
                latitude: 456,
                longitude: 789,
                serial_number: 'XYZ789',
                battery_level: 90,
                city_id: 1,
                station_id: 1,
                scooter_status: 'Inactive'
            };

            await request(app)
                .put(`/elcyckel/v1/scooters/${nonExistentScooterId}`)
                .send(updatedScooter)
                .expect('Content-Type', /json/)
                .expect(404);
        });
    });

    // Test DELETE /scooters/:scooter_id
    describe('DELETE /elcyckel/v1/scooters/:scooter_id', function () {
        it('deletes a scooter and responds with success message', async function () {
            const testScooterId = await getExistingScooterId();

            const res = await request(app)
                .delete(`/elcyckel/v1/scooters/${testScooterId}`)
                .expect('Content-Type', /json/)
                .expect(200);

            assert.equal(res.body.message, 'Scooter deleted successfully');
        });

        it('responds with 404 for deleting non-existent scooter', async function () {
            const nonExistentScooterId = 1002;

            const res = await request(app)
                .delete(`/elcyckel/v1/scooters/${nonExistentScooterId}`)
                .expect('Content-Type', /json/)
                .expect(404);

            assert.equal(res.body.error, 'Scooter not found');
        });
    });


    // Helper function to get an existing city_id from the database
    async function getExistingCityId() {
        const connection = await testPool.getConnection();
        try {
            const result = await connection.query('SELECT city_id FROM scooters ORDER BY scooter_id DESC LIMIT 1');
            return result[0].city_id;
        } finally {
            connection.release();
        }
    }
    // Helper function to get an existing station_id from the database
    async function getExistingStationId() {
        const connection = await testPool.getConnection();
        try {
            const result = await connection.query('SELECT station_id FROM scooters ORDER BY scooter_id DESC LIMIT 1');
            return result[0].station_id;
        } finally {
            connection.release();
        }
    }

    async function getExistingScooterId() {
        const connection = await testPool.getConnection();
        try {
            const result = await connection.query('SELECT scooter_id FROM scooters ORDER BY scooter_id DESC LIMIT 1');
            return result[0].scooter_id;
        } finally {
            connection.release();
        }
    }
});
