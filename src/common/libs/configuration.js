/* jshint node: true */
/**
 * PUSH Notification server
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var fs = require('fs');
var configFile = null;

if (process.env.WAKEUP_CONFIG) {
  configFile = process.env.WAKEUP_CONFIG;
}
if (process.argv.length > 2) {
  configFile = process.argv[2];
}
if (!configFile) {
  configFile = process.cwd() + '/config.default.json';
}

console.log(configFile);
process.configuration = require(configFile);

if (fs.existsSync('version.info')) {
  process.configuration._version = 'v.' +
    fs.readFileSync('version.info').toString();
} else {
  process.configuration._version = '(No version.info file !)';
}

module.exports = process.configuration;
