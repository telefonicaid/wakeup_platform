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

function processWakeUpQuery(paramsString, request, response, cb) {
  response.setHeader('Content-Type', 'text/plain');

  // Check request ...
  if (!paramsString) {
    log.debug('WU_ListenerHTTP_WakeUpRouter --> No required data provided');
    response.statusCode = 400;
    response.write('Bad parameters. No required data provided');
    return;
  }
  var wakeup_data = querystring.parse(paramsString);

  // Check parameters
  if (!net.isIP(wakeup_data.ip) ||     // Is a valid IP address
      isNaN(wakeup_data.port) ||       // The port is a Number
      wakeup_data.port <= 0 || wakeup_data.port > 65535 // Port in a valid range
  ) {
    log.debug('WU_ListenerHTTP_WakeUpRouter --> Bad IP/Port');
    response.statusCode = 400;
    response.write('Bad parameters. Bad IP/Port');
    return;
  }

  // Check protocol
  if ((!wakeup_data.netid || typeof(wakeup_data.netid) !== 'string') &&
       (!wakeup_data.mcc || !wakeup_data.mnc ||
        isNaN(wakeup_data.mcc) || isNaN(wakeup_data.mnc))) {
    log.debug('WU_ListenerHTTP_WakeUpRouter --> Bad NetID OR MCC/MNC');
    response.statusCode = 400;
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

  // Append client information stored in request HEADERS
  wakeup_data.headers = request.headers;

  process.nextTick(function() {
    cb(wakeup_data);
  });
}

module.exports.entrypoint =
  function router_wakeupV1(parsedURL, body, request, response, cb) {
    if (request.method !== 'POST') {
      response.setHeader('Content-Type', 'text/plain');
      response.statusCode = 405;
      response.write('Bad method. Only POST is allowed');
      log.debug('WU_ListenerHTTP_WakeUpRouter --> Bad method - ' +
        request.method);
    } else {
      processWakeUpQuery(body, request, response, cb);
    }
  };
