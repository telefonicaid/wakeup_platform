/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

require('./configuration.js');
var sandman_udp = require('../../../src/local/modules/sandmans/udp.js'),
    mock_udpserver = require('../mocks/udp_server_mock'),
    buffer = require('buffer'),
    assert = require('assert'),
    vows = require('vows');

var testPayload = new Buffer(new Date().toString());
var serverTimeout = null;
var serverTimeoutGracePeriod = 2000;

vows.describe('Sandman UDP tests').addBatch({
  'Sandman module metadata requirements': {
    'metadata info exists': function() {
      assert.isObject(sandman_udp.info);
    },
    'metadata info has a name defined': function() {
      assert.isString(sandman_udp.info.name);
    },
    'metadata info has a plugin type defined': function() {
      assert.isString(sandman_udp.info.type);
    },
    'metadata info has protocol defined': function() {
      assert.isString(sandman_udp.info.protocol);
    },
    'metadata info has description defined': function() {
      assert.isString(sandman_udp.info.description);
    },
    'sandman has an entrypoint function': function() {
      assert.isFunction(sandman_udp.entrypoint);
    },
    'declared protocol is UDP': function() {
      assert.equal(sandman_udp.info.protocol, 'udp');
    }
  },

  'UDP wakeup package': {
    topic: function init_udp_mock_server() {
      var self = this;
      serverTimeout = setTimeout(function() {
        console.log('error');
        self.callback('No response received from server!');
      }, serverTimeoutGracePeriod);
      // Listen on a random PORT
      mock_udpserver(0, this.callback, function onMockServerStarted(port) {
        // Send some payload using Sandman
        sandman_udp.entrypoint('127.0.0.1', port, testPayload);
      });
    },

    'Mock server responded (no timeout)': function(err, data) {
      clearTimeout(serverTimeout);
      assert.isNull(err);
    },

    'Received data is the same we sent': function(err, data) {
      assert.isString(data);
      assert.equal(data, testPayload);
    }
  }
}).export(module);
