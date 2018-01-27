'use strict';

let auth = require('../server/msauth');
let chai = require('chai');
let expect = chai.expect;
let supertest = require('supertest');
let config = require('../server/config.local.js');
const demoUser = config.office365User;
let userAPI = supertest('https://graph.microsoft.com/v1.0/users/' + demoUser);
let sharepointAPI = supertest('https://graph.microsoft.com/v1.0');


describe('Config Options', () => {
  describe('azureClientId & azureClientSecret & azureTokenEndpoint & office365User', () => {
    it('it should return 200', (done) => {
      auth.getAccessToken().then(function(token) {
        userAPI.get('/messages')
          .set('content-type', 'application/json')
          .set('authorization', 'Bearer ' + token)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      }, function(error) {
        done(error);
      });
    });
  });

  describe('outlookInProgressFolder', () => {
    it('it should return 200', (done) => {
      auth.getAccessToken().then(function(token) {
        userAPI.get('/mailFolders/' + config.outlookInProgressFolder + '/messages')
          .set('content-type', 'application/json')
          .set('authorization', 'Bearer ' + token)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      }, function(error) {
        done(error);
      });
    });
  });

  describe('outlookInProgressFolder', () => {
    it('it should return 200', (done) => {
      auth.getAccessToken().then(function(token) {
        userAPI.get('/mailFolders/' + config.outlookInReviewFolder + '/messages')
          .set('content-type', 'application/json')
          .set('authorization', 'Bearer ' + token)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      }, function(error) {
        done(error);
      });
    });
  });

  describe('outlookInProgressFolder', () => {
    it('it should return 200', (done) => {
      auth.getAccessToken().then(function(token) {
        userAPI.get('/mailFolders/' + config.outlookCompletedFolder + '/messages')
          .set('content-type', 'application/json')
          .set('authorization', 'Bearer ' + token)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      }, function(error) {
        done(error);
      });
    });
  });

  describe('office365Calendar', () => {
    it('it should return 200', (done) => {
      auth.getAccessToken().then(function(token) {
        userAPI.get('/calendars/' + config.office365Calendar + '/events')
          .set('content-type', 'application/json')
          .set('authorization', 'Bearer ' + token)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      }, function(error) {
        done(error);
      });
    });
  });

  describe('office365Calendar', () => {
    it('it should return 200', (done) => {
      auth.getAccessToken().then(function(token) {
        sharepointAPI.get('/sites/' + config.sharepointSite)
          .set('content-type', 'application/json')
          .set('authorization', 'Bearer ' + token)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      }, function(error) {
        done(error);
      });
    });
  });

  describe('sharepointList', () => {
    it('it should return 200', (done) => {
      auth.getAccessToken().then(function(token) {
        sharepointAPI.get('/sites/' + config.sharepointSite + '/lists/' + config.sharepointList)
          .set('content-type', 'application/json')
          .set('authorization', 'Bearer ' + token)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      }, function(error) {
        done(error);
      });
    });
  });

});
