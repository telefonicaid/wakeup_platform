#!/usr/bin/env node

/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var redis = require('redis'),
    async = require('async');

function loadTestData(callback) {
  var client = redis.createClient();
  async.parallel([
    function(cb) {
      client.hset('operators', '000-00',
        'BAD OPERATOR, NO JSON DATA', cb);
    },
    function(cb) {
      client.hset('networks', 'networkbad',
        'BAD NETWORK, NO JSON DATA', cb);
    },
    function(cb) {
      client.hset('operators', '001-01',
        '{ "country": "Country1", "operator": "Operator1", "mccmnc": "001-01"' +
        ', "defaultNetwork": "network1-1-1" }', cb);
    },
    function(cb) {
      client.hset('operators', '001-02',
        '{ "country": "Country1", "operator": "Operator2", "mccmnc": "001-02"' +
        ', "defaultNetwork": "network1-2-1" }', cb);
    },
    function(cb) {
      client.hset('operators', '002-01',
        '{ "country": "Country2", "operator": "Operator1", "mccmnc": "002-01"' +
        ', "defaultNetwork": "network2-1-1" }', cb);
    },
    function(cb) {
      client.hset('networks', 'network1-1-1',
        '{ "host": "http://10.1.1.1:9000",' +
        ' "range": ["10.0.0.0/8","192.168.1.0/24"],' +
        ' "network": "001-01" }', cb);
    },
    function(cb) {
      client.hset('networks', 'network1-2-1',
        '{ "host": "http://10.1.2.1:9000", "range": "10.0.0.0/8",' +
        ' "network": "001-02" }', cb);
    },
    function(cb) {
      client.hset('networks', 'network2-1-1',
        '{ "host": "http://10.2.1.1:9000", "range": "10.0.0.0/8",' +
        ' "network": "002-01" }', cb);
    },
    function(cb) {
      client.hset('networks', 'network2-1-1b',
        '{ "host": "http://10.2.1.1:9001", "range": "10.0.0.0/8",' +
        ' "network": "002-01" }', cb);
    }
  ], callback);
}

loadTestData(function() {
  process.exit();
});
