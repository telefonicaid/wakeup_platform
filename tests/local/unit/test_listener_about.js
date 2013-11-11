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

vows.describe('Listener ABOUT').addBatch({
  'about HTML page': {
    topic: function() {
      request('http://localhost:9000/about', this.callback);
    },

    'Server responded with an about page': function(err, response, body) {
      assert.isNull(err);
      assert.isString(body);
      assert.equal(response.statusCode, 200);
    }
  },

  'about HTML page (using alias)': {
    topic: function() {
      request('http://localhost:9000/', this.callback);
    },

    'Server responded with an about page': function(err, response, body) {
      assert.isNull(err);
      assert.isString(body);
      assert.equal(response.statusCode, 200);
    }
  }
}).export(module);
