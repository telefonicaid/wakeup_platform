/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var assert = require('assert'),
    request = require('request'),
    vows = require('vows');

vows.describe('Global node WakeUp tests').addBatch({
  'Bad query': {
    topic: function send_wakeup_bad_parameters() {
      request('http://localhost:8000/wakeup/v1?ip=127.0.0.1&port=1234',
        this.callback);
    },

    'Check status code': function(err, res, body) {
      assert.equal(res.statusCode, 404);
    },
    'Received data has the expected format': function(err, res, body) {
      assert.isString(body);
      assert.equal(body.substr(0, 36), 'Bad parameters. Bad NetID OR MCC/MNC');
    }
  },

  'With Network ID': {
    topic: function send_wakeup_networkID() {
      var r = 'http://localhost:8000/wakeup/v1?' +
              'ip=127.0.0.1&port=1234&netid=network2-1-1';
      request(r, this.callback);
    },

    'Check status code': function(err, res, body) {
      assert.equal(res.statusCode, 200);
    },
    'Received data has the expected format': function(err, res, body) {
      assert.isString(body);
      assert.equal(body.substr(0, 8), 'Accepted');
    }
  },

  'With MCC/MNC': {
    topic: function send_wakeup_MCCMNC() {
      var r = 'http://localhost:8000/wakeup/v1?' +
              'ip=127.0.0.1&port=1234&mcc=214&mnc=07';
      request(r, this.callback);
    },

    'Check status code': function(err, res, body) {
      assert.equal(res.statusCode, 200);
    },
    'Received data has the expected format': function(err, res, body) {
      assert.isString(body);
      assert.equal(body.substr(0, 8), 'Accepted');
    }
  }

}).export(module);
