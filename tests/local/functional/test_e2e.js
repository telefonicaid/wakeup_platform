/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var mock_udpserver = require('../mocks/udp_server_mock'),
    mock_tcpserver = require('../mocks/tcp_server_mock'),
    assert = require('assert'),
    request = require('request'),
    vows = require('vows');

var serverTimeout = null;
var serverTimeoutGracePeriod = 30000;

vows.describe('Local node E2E tests').addBatch({
  'TCP wakeup package (GET)': {
    topic: function init_tcp_mock_server() {
      var self = this;
      serverTimeout = setTimeout(function() {
        console.log('error');
        self.callback('No response received from server!');
      }, serverTimeoutGracePeriod);
      // Listen on a random PORT
      mock_tcpserver(0, this.callback, function onMockServerStarted(port) {
        request({
          url: 'http://localhost:9000/wakeup?proto=tcp&ip=127.0.0.1&port=' +
                port,
          headers: {
            'x-real-ip': '127.0.0.1',
            'x-forwarded-for': '127.0.0.1',
            'x-client-cert-dn': 'DN=Testing',
            'x-client-cert-verified': 'SUCCESS'
          }
        });
      });
    },

    'Mock server responded (no timeout)': function(err, data) {
      clearTimeout(serverTimeout);
      assert.isNull(err);
    },

    'Received data has the expected format': function(err, data) {
      assert.isString(data);
      assert.equal(data.substr(0, 6), 'NOTIFY');
    }
  },

  'UDP wakeup package (GET)': {
    topic: function init_udp_mock_server() {
      var self = this;
      serverTimeout = setTimeout(function() {
        console.log('error');
        self.callback('No response received from server!');
      }, serverTimeoutGracePeriod);
      // Listen on a random PORT
      mock_udpserver(0, this.callback, function onMockServerStarted(port) {
        request({
          url: 'http://localhost:9000/wakeup?ip=127.0.0.1&port=' + port,
          headers: {
            'x-real-ip': '127.0.0.1',
            'x-forwarded-for': '127.0.0.1',
            'x-client-cert-dn': 'DN=Testing',
            'x-client-cert-verified': 'SUCCESS'
          }
        });
      });
    },

    'Mock server responded (no timeout)': function(err, data) {
      clearTimeout(serverTimeout);
      assert.isNull(err);
    },

    'Received data has the expected format': function(err, data) {
      assert.isString(data);
      assert.equal(data.substr(0, 6), 'NOTIFY');
    }
  },

  'TCP wakeup package (POST)': {
    topic: function init_tcp_mock_server() {
      var self = this;
      serverTimeout = setTimeout(function() {
        console.log('error');
        self.callback('No response received from server!');
      }, serverTimeoutGracePeriod);
      // Listen on a random PORT
      mock_tcpserver(0, this.callback, function onMockServerStarted(port) {
        var body = 'proto=tcp&ip=127.0.0.1&port=' + port;
        var url = 'http://localhost:9000/wakeup';
        request.post(url, {
          body: body,
          headers: {
            'x-real-ip': '127.0.0.1',
            'x-forwarded-for': '127.0.0.1',
            'x-client-cert-dn': 'DN=Testing',
            'x-client-cert-verified': 'SUCCESS'
          }
        }, function(error, response, body) {
          if (error) {
            self.callback(error.toString());
            return;
          }
          if (response.statusCode !== 200) {
            self.callback('Bad statusCode=' + response.statusCode);
            return;
          }
        });
      });
    },

    'Mock server responded (no timeout)': function(err, data) {
      clearTimeout(serverTimeout);
      assert.isNull(err);
    },

    'Received data has the expected format': function(err, data) {
      assert.isString(data);
      assert.equal(data.substr(0, 6), 'NOTIFY');
    }
  },

  'UDP wakeup package (POST)': {
    topic: function init_udp_mock_server() {
      var self = this;
      serverTimeout = setTimeout(function() {
        console.log('error');
        self.callback('No response received from server!');
      }, serverTimeoutGracePeriod);
      // Listen on a random PORT
      mock_udpserver(0, this.callback, function onMockServerStarted(port) {
        var body = 'ip=127.0.0.1&port=' + port;
        var url = 'http://localhost:9000/wakeup';
        request.post(url, {
          body: body,
          headers: {
            'x-real-ip': '127.0.0.1',
            'x-forwarded-for': '127.0.0.1',
            'x-client-cert-dn': 'DN=Testing',
            'x-client-cert-verified': 'SUCCESS'
          }
        }, function(error, response, body) {
          if (error) {
            self.callback(error.toString());
            return;
          }
          if (response.statusCode !== 200) {
            self.callback('Bad statusCode=' + response.statusCode);
            return;
          }
        });
      });
    },

    'Mock server responded (no timeout)': function(err, data) {
      clearTimeout(serverTimeout);
      assert.isNull(err);
    },

    'Received data has the expected format': function(err, data) {
      assert.isString(data);
      assert.equal(data.substr(0, 6), 'NOTIFY');
    }
  }

}).export(module);
