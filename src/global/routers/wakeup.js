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
  virtualpath: 'wakeup/v1',
  description: 'The heart of the system: Used to wakeup devices (V1)'
};

module.exports.entrypoint =
function router_wakeupV1(parsedURL, request, response, cb) {
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
  if ((!wakeup_data.netid || typeof(wakeup_data.netid) !== 'string') &&
       (!wakeup_data.mcc || !wakeup_data.mnc ||
        isNaN(wakeup_data.mcc) || isNaN(wakeup_data.mnc))) {
    log.debug('WU_ListenerHTTP_WakeUpRouter --> Bad NetID OR MCC/MNC');
    response.statusCode = 404;
    response.write('Bad parameters. Bad NetID OR MCC/MNC');
    return;
  }

  // All Ok, we can wakeup the device !
  log.debug('WU_ListenerHTTP_WakeUpRouter --> WakeUp IP = ' + wakeup_data.ip +
    ':' + wakeup_data.port +
    ' network (' + wakeup_data.mcc + '-' + wakeup_data.mnc + ' | ' +
      wakeup_data.netid + ')');

  response.statusCode = 200;
  response.write('Accepted');
  process.nextTick(function() {
    cb(wakeup_data);
  });
};
