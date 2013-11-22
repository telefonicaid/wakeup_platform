/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var config = process.configuration;
var log = require('../../shared_libs/logger')(config.log4js),
    net = require('net');

module.exports.info = {
  protocol: 'tcp',
  description: 'This sandman will wakeup using TCP packets'
};

module.exports.sandman = function sandman_tcp(ip, port, payload) {
  // TCP Notification Message
  var tcp4Client = net.createConnection({host: ip, port: port},
    function() { //'connect' listener
      log.debug('TCP Client connected');
      tcp4Client.write(payload);
      tcp4Client.end();
    });
  tcp4Client.on('error', function(e) {
    log.debug('TCP Client error ' + JSON.stringify(e));
    log.info('Error sending TCP Package to ' + ip + ':' + port);
  });
  tcp4Client.on('end', function() {
    log.debug('TCP Client disconected');
    log.info('TCP Package correctly sent to ' + ip + ':' + port);
  });
};
