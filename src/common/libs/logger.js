/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var log4js = require('log4js'),
    config = process.configuration.log4js;

function getLogger() {
  config.replaceConsole = true;
  log4js.configure(config);
  return log4js.getLogger(config.appenders[0].category);
}

module.exports = getLogger();
