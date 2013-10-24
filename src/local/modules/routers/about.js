/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

module.exports = function router_about(parsedURL, request, response) {
  response.setHeader('Content-Type', 'text/html');
  response.statusCode = 200;
  response.write('about to-be-done');
};
