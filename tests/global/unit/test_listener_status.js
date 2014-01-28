/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var request = require('request'),
    assert = require('assert'),
    vows = require('vows');

vows.describe('Listener STATUS').addBatch({
  'status HTML page': {
    topic: function() {
      request({
        url: 'http://localhost:8000/status',
        headers: {
          'x-real-ip': '127.0.0.1',
          'x-forwarded-for': '127.0.0.1',
          'x-client-cert-dn': 'DN=Testing',
          'x-client-cert-verified': 'SUCCESS'
        }
      }, this.callback);
    },

    'Server responded with an status page': function(err, response, body) {
      assert.isNull(err);
      assert.isString(body);
      assert.equal(response.statusCode, 200);
    }
  }
}).export(module);
