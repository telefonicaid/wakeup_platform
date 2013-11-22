/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var log = require('../shared_libs/logger'),
    querystring = require('querystring'),
    net = require('net');

module.exports.info = {
  name: 'wakeupRouter',
  type: 'router',
  virtualpath: 'wakeup',
  description: 'The heart of the system: Used to wakeup devices'
};

module.exports.entrypoint =
function router_wakeup(parsedURL, request, response, cb) {
  var wakeup_data = {};

  response.setHeader('Content-Type', 'text/plain');

  // Check request ...
  if (!parsedURL.query) {
    log.debug('WU_ListenerHTTP_WakeUpRouter --> No required data provided');
    response.statusCode = 404;
    response.write('Bad parameters. No required data provided');
    return;
  }
  wakeup_data = querystring.parse(parsedURL.query);
  if (wakeup_data.proto) {
    wakeup_data.protocol = wakeup_data.proto;
  } else {
    wakeup_data.protocol = 'udp';
  }

  // Check parameters
  if (!net.isIP(wakeup_data.ip) ||     // Is a valid IP address
      isNaN(wakeup_data.port) ||       // The port is a Number
      wakeup_data.port <= 0 || wakeup_data.port > 65535 // Port in a valid range
  ) {
    log.debug('WU_ListenerHTTP_WakeUpRouter --> Bad IP/Port');
    response.statusCode = 404;
    response.write('Bad parameters. Bad IP/Port');
    return;
  }

  // Check protocol
  if (wakeup_data.protocol !== 'udp' && wakeup_data.protocol !== 'tcp') {
    log.debug('WU_ListenerHTTP_WakeUpRouter --> Bad Protocol');
    response.statusCode = 404;
    response.write('Bad parameters. Bad Protocol');
    return;
  }

  // All Ok, we can wakeup the device !
  log.debug('WU_ListenerHTTP_WakeUpRouter --> WakeUp IP = ' + wakeup_data.ip +
    ':' + wakeup_data.port + ' through (' + wakeup_data.protocol + ')');

  response.statusCode = 200;
  response.write('Accepted');
  process.nextTick(function() {
    cb(wakeup_data);
  });
};
