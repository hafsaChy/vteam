// test/server/cityRoutes.test.js
const request = require('supertest');
const app = require('../../index');
const chai = require('chai');
const assert = chai.assert;
const mariadb = require('mariadb');
const testDbConfig = require('../test-db-config');

describe('City Routes', function () {
    let testPool;

    // Test database setup
    before(async function () {
        this.timeout(10000);
        testPool = mariadb.createPool(testDbConfig);
        const connection = await testPool.getConnection();
        try {
            await connection.query('CREATE TABLE IF NOT EXISTS cities (city_id INT AUTO_INCREMENT PRIMARY KEY, city_name VARCHAR(255))');
        } finally {
            connection.release();
        }
    });

    // Test database cleanup
    after(async function () {
        const connection = await testPool.getConnection();
        try {
            await connection.query('DELETE FROM scooters WHERE city_id IN (SELECT city_id FROM cities)'); // check

            await connection.query('DELETE FROM stations WHERE city_id IN (SELECT city_id FROM cities)'); // check

            // Clean up the 'cities' table after all tests
            await connection.query('DROP TABLE IF EXISTS cities');
        } finally {
            connection.release();
            // Close the database connection
            await testPool.end();
        }
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
            const testCityId = 1;

            const res = await request(app)
                .get(`/elcyckel/v1/cities/${testCityId}`)
                .expect('Content-Type', /json/)
                .expect(200);

            assert.isObject(res.body, 'Response body should be an object');
            assert.equal(res.body.city_id, testCityId, 'City ID should match');
        });
    });

    // Test POST /elcyckel/v1/cities
    describe('POST /elcyckel/v1/cities', function () {
        it('creates a new city and responds with success message', async function () {
            const newCity = { city_name: 'New City' };

            const res = await request(app)
                .post('/elcyckel/v1/cities')
                .send(newCity)
                .expect('Content-Type', /json/)
                .expect(200);

            assert.equal(res.body.message, 'City created successfully');
            assert.isNumber(res.body.insertedId, 'Inserted ID should be a number');
        });
    });

    // Test PUT /elcyckel/v1/cities/:city_id
    describe('PUT /elcyckel/v1/cities/:city_id', function () {
        it('updates a city and responds with success message', async function () {
            const testCityId = 1;
            const updatedCity = { city_name: 'Updated City' };

            const res = await request(app)
                .put(`/elcyckel/v1/cities/${testCityId}`)
                .send(updatedCity)
                .expect('Content-Type', /json/)
                .expect(200);

            assert.equal(res.body.message, 'City updated successfully');
        });
    });

    //Test DELETE /elcyckel/v1/cities/:city_id
    describe('DELETE /elcyckel/v1/cities/:city_id', function () {
        it('deletes a city and responds with success message', async function () {
            const testCityId = 1;

            const res = await request(app)
                .delete(`/elcyckel/v1/cities/${testCityId}`)
                .expect('Content-Type', /json/)
                .expect(200);

            assert.equal(res.body.message, 'City deleted successfully');
        });
    });
});
