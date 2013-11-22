/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var fs = require('fs');

module.exports.info = {
  name: 'aboutRouter',
  type: 'router',
  virtualpath: 'about',
  alias: [
    ''            // No path => default router
  ],
  description: 'This module shows the about page to the client'
};

module.exports.entrypoint = function router_about(parsedURL, req, res) {
  res.setHeader('Content-Type', 'text/html;charset=UTF-8');
  res.statusCode = 200;
  res.write('<html><head>');
  res.write(
    '<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">');
  res.write('</head><body>');
  res.write('<h1>WakeUp mobile platform</h1>');
  var version = '';
  if (fs.existsSync('version.info'))
    version = 'v.' + fs.readFileSync('version.info');
  else
    version = '(No version.info file !)';
  res.write('<h2>Global node ' + version.toString() + '</h2>');
  res.write('© Telefónica Digital, 2013<br />');
  res.write('</body></html>');
};
