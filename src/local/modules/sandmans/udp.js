/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var config = require('../../config.default.json'),
    log = require('../../shared_libs/logger')(config.log4js),
    dgram = require('dgram');

module.exports = function sandman_udp(ip, port, payload) {
  // UDP Notification Message
  var udp4Client = dgram.createSocket('udp4');
  udp4Client.send(
    payload, 0, payload.length,
    port, ip,
    function(err, bytes) {
      if (err) {
        log.info('Error sending UDP Datagram to ' + ip + ':' + port);
      }
      else {
        log.info('UDP Datagram sent to ' + ip + ':' + port);
        udp4Client.close();
      }
    });
};
