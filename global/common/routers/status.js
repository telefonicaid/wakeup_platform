/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

module.exports.info = {
  name: 'statusRouter',
  type: 'router',
  virtualpath: 'status',
  description: 'Used to check server status. Needed by load-balancers'
};

module.exports.entrypoint = function router_status(parsedURL, body, req, res) {
  // Return status mode to be used by load-balancers
  res.setHeader('Content-Type', 'text/html');
  res.statusCode = 200;
  res.write('OK');
  res.write('<br>common status to-be-done');
};
