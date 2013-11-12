/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var assert = require('assert'),
    vows = require('vows');

vows.describe('DUMMY').addBatch({
  'dummy': {
    'dummy': function() {
      assert.isTrue(true);
    }
  }
}).export(module);
