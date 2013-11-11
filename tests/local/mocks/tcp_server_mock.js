/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var net = require('net');

module.exports = function tcp_server_mock(port, callback, ready) {
  var server = net.createServer(function(c) {
    console.log('tcp_server_mock: server connected');
    c.on('end', function() {
      console.log('tcp_server_mock: server disconnected');
    });
    c.on('data', function(d) {
      console.log('tcp_server_mock: data received - ' + d);
      callback(null, d.toString());
      c.end();
    });
  });
  server.listen(port, '127.0.0.1', function() {
    address = server.address();
    console.log('tcp_server_mock: opened server on %j', address);
    ready(server.address().port);
  });
};
