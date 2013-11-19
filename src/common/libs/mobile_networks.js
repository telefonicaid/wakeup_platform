/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var redis = require('redis');

module.exports = (function mobile_networks() {
  var client = redis.createClient();
  init();

  function init() {
    var client_cache = redis.createClient();
    client_cache.on('message', function onMessage(channel, message) {
      if (channel === 'networks_changed') {
        clearCache();
      }
    });
    client_cache.subscribe('networks_changed');

    client.on('error', function(err) {
      console.error('Mobile networks error: ' + err);
    });
    client_cache.on('error', function(err) {
      console.error('Mobile networks cache error: ' + err);
    });
  }

  function clearCache() {
    console.log('[ToDo] limpiando cache');
  }

  function getOperator(mcc, mnc, callback) {
    client.hget('operators', mcc + '-' + mnc, function(e, operatorData) {
      try {
        var data = JSON.parse(operatorData);
        callback(null, data);
      } catch (e) {
        callback(e);
      }
    });
  }

  function getNetworkByNetID(netid, callback) {
    client.hget('networks', netid, function(e, networkData) {
      try {
        var data = JSON.parse(networkData);
        callback(null, data);
      } catch (e) {
        callback(e);
      }
    });
  }

  function getNetworkByMCCMNC(mcc, mnc, callback) {
    getOperator(mcc, mnc, function(e, data) {
      if (e) {
        return callback(e);
      }
      if (data.defaultNetwork) {
        getNetworkByNetID(data.defaultNetwork, callback);
      } else {
        callback(e);
      }
    });
  }

  return {
    getNetwork: function(netid, callback) {
      if (typeof(callback) != 'function') {
        callback = function() {};
      }

      if (typeof(netid) === 'object') {
        if (!netid.mcc || !netid.mnc) {
          return callback('No valid netid object');
        }
        getNetworkByMCCMNC(netid.mcc, netid.mnc, callback);
      } else {
        getNetworkByNetID(netid, callback);
      }
    },

    getOperator: function(operator, callback) {
      if (typeof(callback) != 'function') {
        callback = function() {};
      }

      if (typeof(operator) !== 'object' ||
          !operator.mcc || !operator.mnc) {
          return callback('No valid operator object');
      }

      getOperator(operator.mcc, operator.mnc, callback);
    }
  };
})();
