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

function removeTestData(callback) {
  var client = redis.createClient();
  async.parallel([
    function(cb) {
      client.hdel('operators', '000-00', cb);
    },
    function(cb) {
      client.hdel('networks', 'networkbad', cb);
    },
    function(cb) {
      client.hdel('operators', '001-01', cb);
    },
    function(cb) {
      client.hdel('operators', '001-02', cb);
    },
    function(cb) {
      client.hdel('operators', '002-01', cb);
    },
    function(cb) {
      client.hdel('networks', 'network1-1-1', cb);
    },
    function(cb) {
      client.hdel('networks', 'network1-2-1', cb);
    },
    function(cb) {
      client.hdel('networks', 'network2-1-1', cb);
    },
    function(cb) {
      client.hdel('networks', 'network2-1-1b', cb);
    }
  ], callback);
}

removeTestData(function() {
  process.exit();
});
