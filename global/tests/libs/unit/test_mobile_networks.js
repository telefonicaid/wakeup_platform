/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

require('./configuration.js');
var mn = require('../../../src/libs/mobile_networks'),
    assert = require('assert'),
    vows = require('vows'),
    net = require('net');

function checkRanges(range) {
  function checkNetwork(network) {
    try {
      var aux = network.split('/');
    } catch (e) {
      assert.isFalse(true);
      return;
    }
    assert.isNumber(net.isIP(aux[0]));
    assert.isNumber(parseInt(aux[1]));
  }
  if (typeof(range) !== 'string') {
    assert.isArray(range);
    for (a = 0; a < range.length; a++) {
      checkNetwork(range[a]);
    }
  } else {
    checkNetwork(range);
  }
}

vows.describe('Mobile Networks tests (bad payload)').addBatch({
  'Getting invalid operator': {
    topic: function() {
      mn.getOperator({mcc: '000', mnc: '00'}, this.callback);
    },
    'Error returned': function(err, data) {
      assert.isNotNull(err);
    }
  },

  'Getting invalid operator (Bad MNC)': {
    topic: function() {
      mn.getOperator({mcc: '000', bad: '00'}, this.callback);
    },
    'Error returned': function(err, data) {
      assert.isNotNull(err);
    }
  },

  'Getting invalid operator (Bad MCC)': {
    topic: function() {
      mn.getOperator({bad: '000', mnc: '00'}, this.callback);
    },
    'Error returned': function(err, data) {
      assert.isNotNull(err);
    }
  },

  'Getting invalid operator (Bad object)': {
    topic: function() {
      mn.getOperator('', this.callback);
    },
    'Error returned': function(err, data) {
      assert.isNotNull(err);
    }
  },

  'Getting invalid network': {
    topic: function() {
      mn.getNetwork('networkbad', this.callback);
    },
    'Error returned': function(err, data) {
      assert.isNotNull(err);
    }
  },

  'Getting invalid network (bad parameter)': {
    topic: function() {
      mn.getNetwork('networkbad', this.callback);
    },
    'Error returned': function(err, data) {
      assert.isNotNull(err);
    }
  },

  'Getting operator data': {
    topic: function() {
      mn.getOperator({mcc: '001', mnc: '01'}, this.callback);
    },
    'No error returned': function(err, data) {
      assert.isNull(err);
    },
    'Operator data returned is an object': function(err, data) {
      assert.isObject(data);
    },
    'Operator data returned has a country': function(err, data) {
      assert.isString(data.country);
    },
    'Operator data returned has an operator name': function(err, data) {
      assert.isString(data.operator);
    },
    'Operator data returned has mccmnc data': function(err, data) {
      assert.isString(data.mccmnc);
    },
    'Operator defaultNetwork, if exists is an string': function(err, data) {
      if (data.defaultNetwork) {
        assert.isString(data.defaultNetwork);
      } else {
        assert.isTrue(true);
      }
    }
  },

  'Getting default network data': {
    topic: function() {
      mn.getNetwork({mcc: '001', mnc: '01'}, this.callback);
    },
    'No error returned': function(err, data) {
      assert.isNull(err);
    },
    'Network has a host': function(err, data) {
      assert.isString(data.host);
    },
    'Network has a defined range': function(err, data) {
      checkRanges(data.range);
    },
    'Network has a parent network id': function(err, data) {
      assert.isString(data.network);
    }
  },

  'Getting network data': {
    topic: function() {
      mn.getNetwork('network2-1-1b', this.callback);
    },
    'No error returned': function(err, data) {
      assert.isNull(err);
    },
    'Network has a host': function(err, data) {
      assert.isString(data.host);
    },
    'Network has a defined range': function(err, data) {
      checkRanges(data.range);
    },
    'Network has a parent network id': function(err, data) {
      assert.isString(data.network);
    }
  },

  'Check Network IP range (in Range 1)': {
    topic: function() {
      mn.checkNetwork('network1-1-1', '10.1.2.3', this.callback);
    },
    'No error returned': function(err, data) {
      assert.isNull(err);
    },
    'Network has a host': function(err, data) {
      assert.isString(data.host);
    },
    'Network has a defined range': function(err, data) {
      checkRanges(data.range);
    },
    'Network has a parent network id': function(err, data) {
      assert.isString(data.network);
    }
  },

  'Check Network IP range (in Range 2)': {
    topic: function() {
      mn.checkNetwork('network1-1-1', '192.168.1.3', this.callback);
    },
    'No error returned': function(err, data) {
      assert.isNull(err);
    },
    'Network has a host': function(err, data) {
      assert.isString(data.host);
    },
    'Network has a defined range': function(err, data) {
      checkRanges(data.range);
    },
    'Network has a parent network id': function(err, data) {
      assert.isString(data.network);
    }
  },

  'Check Network IP range (Out of range)': {
    topic: function() {
      mn.checkNetwork('network1-1-1', '192.168.2.10', this.callback);
    },
    'Error returned': function(err, data) {
      assert.isNotNull(data);
    }
  }
}).export(module);
