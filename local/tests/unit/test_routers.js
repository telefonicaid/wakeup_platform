/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var fs = require('fs'),
    assert = require('assert'),
    vows = require('vows');

var routers = {};

vows.describe('HTTP routers tests').addBatch({
  'HTTP routers metadata requirements': {
    'topic': function loadRouters() {
      var routerModules = fs.readdirSync('../../src/routers');
      var numberOfRouters = 0;
      for (var i = 0; i < routerModules.length; i++) {
        if (routerModules[i].substr(-2) === 'js') {
          try {
            routers[numberOfRouters] =
              require('../../../src/routers/' + routerModules[i]);
            numberOfRouters++;
          } catch (e) {
            console.log('Error - ' + e);
          }
        }
      }
      this.callback(null, numberOfRouters);
    },
    'metadata info exists': function(err, numberOfRouters) {
      for (var i = 0; i < numberOfRouters; i++) {
        assert.isObject(routers[i].info);
      }
    },
    'metadata info has a name property': function(err, numberOfRouters) {
      for (var i = 0; i < numberOfRouters; i++) {
        assert.isString(routers[i].info.name);
      }
    },
    'metadata info has a plugin type property': function(err, numberOfRouters) {
      for (var i = 0; i < numberOfRouters; i++) {
        assert.isString(routers[i].info.type);
      }
    },
    'metadata info has virtualpath property': function(err, numberOfRouters) {
      for (var i = 0; i < numberOfRouters; i++) {
        assert.isString(routers[i].info.virtualpath);
      }
    },
    'metadata info has description property': function(err, numberOfRouters) {
      for (var i = 0; i < numberOfRouters; i++) {
        assert.isString(routers[i].info.description);
      }
    },
    'metadata info has alias property': function(err, numberOfRouters) {
      for (var i = 0; i < numberOfRouters; i++) {
        if (routers[i].info.alias) {
          assert.isArray(routers[i].info.alias);
          for (var j = 0; j < routers[i].info.alias.length; j++) {
            assert.isString(routers[i].info.alias[j]);
          }
        } else {
          // It's optional
          assert.isTrue(true);
        }
      }
    },
    'router has an entrypoint exported': function(err, numberOfRouters) {
      for (var i = 0; i < numberOfRouters; i++) {
        assert.isFunction(routers[i].entrypoint);
      }
    }

  }
}).export(module);
