/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var config = require('../config.default.json'),
    log = require('../shared_libs/logger')(config.log4js),
    sandman_udp = require('./sandmans/udp'),
    sandman_tcp = require('./sandmans/tcp');

function wakeup_sender() {
  // Constants
  this.PROTOCOL_UDPv4 = 'udp';
  this.PROTOCOL_TCPv4 = 'tcp';
}

wakeup_sender.prototype = {
  wakeup: function _wakeup(ip, port, protocol) {
    log.debug('WU_Sender::wakeup => ' + ip + ':' + port + ' through ' +
      protocol);
    var message = new Buffer('NOTIFY ' + ip + ':' + port);

    switch (protocol) {
    case this.PROTOCOL_TCPv4:
      sandman_tcp(ip, port, message);
      break;
    case this.PROTOCOL_UDPv4:
      sandman_udp(ip, port, message);
      break;

    default:
      log.error('Protocol (' + protocol + ') not supported');
    }
  }
};

var wusender = new wakeup_sender();
function getWakeUpSender() {
  return wusender;
}
module.exports = getWakeUpSender();
