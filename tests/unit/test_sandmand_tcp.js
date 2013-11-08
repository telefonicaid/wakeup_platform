/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var sandman_tcp = require('../../src/local/modules/sandmans/tcp.js'),
    mock_tcpserver = require('../mocks/tcp_server_mock'),
    assert = require('assert'),
    vows = require('vows');

var testPayload = new Date().toString();
var serverTimeout = null;
var serverTimeoutGracePeriod = 2000;

vows.describe('Sandman TCP tests').addBatch({
  'Sandman module metadata requirements': {
    'metadata info exists': function() {
      assert.isObject(sandman_tcp.info);
    },
    'metadata info has protocol defined': function() {
      assert.isString(sandman_tcp.info.protocol);
    },
    'metadata info has description defined': function() {
      assert.isString(sandman_tcp.info.description);
    },
    'sandman has a "sandman" function': function() {
      assert.isFunction(sandman_tcp.sandman);
    },
    'declared protocol is TCP': function() {
      assert.equal(sandman_tcp.info.protocol, 'tcp');
    }
  },

  'TCP wakeup package': {
    topic: function init_tcp_mock_server() {
      var self = this;
      serverTimeout = setTimeout(function() {
        console.log("error");
        self.callback('No response received from server!');
      }, serverTimeoutGracePeriod);
      // Listen on a random PORT
      mock_tcpserver(0, this.callback, function onMockServerStarted(port) {
        // Send some payload using Sandman
        sandman_tcp.sandman('127.0.0.1', port, testPayload);
      });
    },

    'Server responded (no timeout)': function(err,data) {
      clearTimeout(serverTimeout);
      assert.isNull(err);
    },

    'Received data is the same we sent': function(err, data) {
      assert.isString(data);
      assert.equal(data, testPayload);
    }
  }
}).export(module);
