const request = require('supertest');
const app = require('../../app/index');
const assert = require('chai').assert;

describe('GET /', function () {
  it('responds with JSON containing ["Svenska Elsparkcyklar AB"]', function (done) {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);

        assert.deepEqual(res.body, ['Svenska Elsparkcyklar AB']);
        done();
      });
  });
});