// test/server/cityRoutes.test.js
const request = require('supertest');
const app = require('../../index');
const chai = require('chai');
const assert = chai.assert;
const mariadb = require('mariadb');
const testDbConfig = require('../test-db-config');

describe('City Routes', function () {
    let testPool;
    before(async function () {
        this.timeout(10000);
        testPool = mariadb.createPool(testDbConfig);
        const connection = await testPool.getConnection();

        try {
            await connection.query(`
                CREATE TABLE IF NOT EXISTS cities (
                    city_id INT AUTO_INCREMENT,
                    city_name VARCHAR(255),
                    PRIMARY KEY (city_id)
                );`);
        } finally {
            connection.release();
        }
    });

    // Test database cleanup
    // after(async function () {
    //     try {
    //         this.timeout(15000); // Set a higher timeout (e.g., 15 seconds)
    //         const connection = await testPool.getConnection();
    //         // const testCityId = await getExistingCityId();

    //         // // Delete dependent records
    //         // await connection.query('DELETE FROM receipts WHERE scooter_id IN (SELECT scooter_id FROM scooters WHERE city_id = ?);', [testCityId]);
    //         // await connection.query('DELETE FROM scooters WHERE city_id = ?', [testCityId]);
    //         // await connection.query('DELETE FROM stations WHERE city_id = ?', [testCityId]);
    //         // await connection.query('DELETE FROM cities WHERE city_id = ?', [testCityId]);


    //         // Now drop the cities table
    //         await connection.query(`
    //             DELETE FROM cities WHERE city_id = 'New City1';
    //         `);
    //     } finally {
    //         // Close the database connection
    //         if (testPool) {
    //             await testPool.end();
    //         }
    //     }
    // });

    after(async function () {
        const connection = await testPool.getConnection();
        await connection.rollback(); // Rollback the changes
        connection.release();
    });
    

    // Test POST /elcyckel/v1/cities
    describe('POST /elcyckel/v1/cities', function () {
        it('creates a new city and responds with success message', async function () {
            const newCity = { city_name: 'New City1' };

            const res = await request(app)
                .post('/elcyckel/v1/cities')
                .send(newCity)
                .expect('Content-Type', /json/)
                .expect(200);

            assert.equal(res.body.message, 'City created successfully');
            assert.isNumber(res.body.insertedId, 'Inserted ID should be a number');
        });
    });

    // Test GET /elcyckel/v1/cities
    describe('GET /elcyckel/v1/cities', function () {
        it('responds with JSON containing an array of cities', async function () {
            const res = await request(app)
                .get('/elcyckel/v1/cities')
                .expect('Content-Type', /json/)
                .expect(200);

            assert.isArray(res.body, 'Response body should be an array');
        });
    });

    // Test GET /elcyckel/v1/cities/:city_id
    describe('GET /elcyckel/v1/cities/:city_id', function () {
        it('responds with JSON containing a single city', async function () {
            const testCityId = await getCityId();
            console.log(getCityId());

            const res = await request(app)
                .get(`/elcyckel/v1/cities/${testCityId}`)
                .expect('Content-Type', /json/)
                .expect(200);

            assert.isObject(res.body, 'Response body should be an object');
            assert.equal(res.body.city_id, testCityId, 'City ID should match');
        });
    });

    // Test PUT /elcyckel/v1/cities/:city_id
    describe('PUT /elcyckel/v1/cities/:city_id', function () {
        it('updates a city and responds with success message', async function () {
            const testCityId = await getCityId();
            const updatedCity = { city_name: 'Updated City' };

            const res = await request(app)
                .put(`/elcyckel/v1/cities/${testCityId}`)
                .send(updatedCity)
                .expect('Content-Type', /json/)
                .expect(200);

            assert.equal(res.body.message, 'City updated successfully');
        });
    });

    // Test DELETE /elcyckel/v1/cities/:city_id
    // describe('DELETE /elcyckel/v1/cities/:city_id', function () {
    //     it('deletes a city and responds with success message', async function () {
    //         const testCityId = await getCityId();
    //         console.log(testCityId)

    //         // Delete dependent records first
    //         // await deleteDependentRecords(testCityId);

    //         // Now delete the city
    //         const res = await request(app)
    //             .delete(`/elcyckel/v1/cities/${testCityId}`)
    //             .expect('Content-Type', /json/)
    //             .expect(200);

    //         assert.equal(res.body.message, 'City deleted successfully');
    //     });
    // });

    // Helper function to delete dependent records
    // async function deleteDependentRecords() {
    //     const connection = await testPool.getConnection();
    //     try {
    //         // Delete dependent records
    //         // await connection.query('DELETE FROM receipts WHERE scooter_id IN (SELECT scooter_id FROM scooters WHERE city_id = ?)', [cityId]);
    //         // await connection.query('DELETE FROM scooters WHERE city_id = ?', [cityId]);
    //         // await connection.query('DELETE FROM stations WHERE city_id = ?', [cityId]);
    //         await connection.query(`'DELETE FROM cities WHERE city_name = 'New City1'`);
    //     } finally {
    //         connection.release();
    //     }
    // }


    // Helper function to get an existing city_id from the database
    async function getCityId() {
        const connection = await testPool.getConnection();
        try {
            const result = await connection.query('SELECT city_id FROM cities ORDER BY city_id DESC LIMIT 1');

            // Check if there is at least one row in the result
            if (result.length > 0) {
                return result[0].city_id;
            } else {
                // Handle the case where no city_id is found
                console.error('No existing city_id found in the database.');
                throw new Error('No existing city_id found in the database.');
            }
        } finally {
            connection.release();
        }
    }

});
