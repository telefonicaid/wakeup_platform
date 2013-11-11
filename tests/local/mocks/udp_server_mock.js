/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var dgram = require('dgram');

module.exports = function udp_server_mock(port, callback, ready) {
  var server = dgram.createSocket('udp4');

  server.on('error', function(err) {
    console.log('udp_server_mock: server error:\n' + err.stack);
    callback(err.stack);
    server.close();
  });

  server.on('message', function(msg, rinfo) {
    console.log('udp_server_mock: server got: ' + msg + ' from ' +
      rinfo.address + ':' + rinfo.port);
    callback(null, msg.toString());
  });

  server.on('listening', function() {
    var address = server.address();
    console.log('udp_server_mock: server listening ' +
      address.address + ':' + address.port);
    ready(server.address().port);
  });

  server.bind(port);
};

process.on('uncaughtException', function(err) {
console.log('Caught exception: ' + err.stack);
});
