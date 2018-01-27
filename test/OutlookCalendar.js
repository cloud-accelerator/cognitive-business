'use strict';

let auth = require('../server/msauth');
let chai = require('chai');
let expect = chai.expect;
let supertest = require('supertest');
let api = supertest('http://localhost:4001/api');

describe('OutlookCalendar', () => {
  describe('/GET messages', () => {
    it('it should GET a message', (done) => {
      api.get('/Messages/greet')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(res.body.greeting).to.equal('Sender says hello to receiver');
          done();
        });
    });
  });
});
