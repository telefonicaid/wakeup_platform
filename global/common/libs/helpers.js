/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

'use strict';

module.exports.checkCallback = function checkCallback(callback) {
  if (typeof(callback) != 'function') {
    callback = function() {};
  }
  return callback;
};
