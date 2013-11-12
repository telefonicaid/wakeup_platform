/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var fs = require('fs');

module.exports.info = {
  virtualpath: 'about',
  alias: [
    ''            // No path => default router
  ],
  description: 'This module shows the about page to the client'
};

module.exports.router = function router_about(parsedURL, request, response) {
  response.setHeader('Content-Type', 'text/html;charset=UTF-8');
  response.statusCode = 200;
  response.write('<html><head>');
  response.write(
    '<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">');
  response.write('</head><body>');
  response.write('<h1>WakeUp mobile platform</h1>');
  var version = '';
  if (fs.existsSync('version.info'))
    version = 'v.' + fs.readFileSync('version.info');
  else
    version = '(No version.info file !)';
  response.write('<h2>Local node ' + version.toString() + '</h2>');
  response.write('&copy; Telefónica Digital, 2013<br />');
  response.write('</body></html>');
};
