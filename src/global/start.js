/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

global = require('./main');
var server = new global.WU_Global_Server();
server.start();

/////////////////////////
// On close application
function onClose() {
  console.info('Received interruption (2) signal');
  server.stop();

}
function onKill() {
  console.info('Received termination (15) signal');
  server.stop();
}
process.on('SIGINT', onClose);    // 2
process.on('SIGTERM', onKill);    // 15
