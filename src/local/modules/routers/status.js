/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

module.exports = function router_status(parsedURL, request, response) {
  // Return status mode to be used by load-balancers
  response.setHeader('Content-Type', 'text/html');
  response.statusCode = 200;
  response.write('OK');
  response.write('<br>status to-be-done');
};
