/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var config = process.configuration;
var log = require('./logger')(config.log4js),
    url = require('url');

function ListenerHttp(ip, port, ssl, routers, callback) {
  if (typeof(callback) != 'function') {
    callback = function() {
      log.fatal('WU_ListenerHTTP: No wakeup callback method defined !');
    };
  }
  this.routers = routers;
  this.ip = ip;
  this.port = port;
  this.ssl = ssl;
  this.cb = callback;
}

ListenerHttp.prototype = {
  init: function() {
    log.info('Starting WakeUp ListenerHttp');

    // Create a new HTTP(S) ListenerHttp
    if (this.ssl) {
      var options = {
        ca: helpers.getCaChannel(),
        key: fs.readFileSync(config.ssl.key),
        cert: fs.readFileSync(config.ssl.cert)
      };
      this.server = require('https').createServer(options,
        this.onHTTPMessage.bind(this));
    } else {
      this.server = require('http').createServer(this.onHTTPMessage.bind(this));
    }
    this.server.listen(this.port, this.ip);
    log.info('WU_ListenerHTTP::init --> HTTP' + (this.ssl ? 'S' : '') +
             ' WakeUp ListenerHttp starting on ' + this.ip + ':' + this.port);
  },

  stop: function() {
    this.server.close(function() {
      log.info('WU_ListenerHTTP::stop --> WU_ListenerHTTP closed correctly');
    });
  },

  //////////////////////////////////////////////
  // HTTP callbacks
  //////////////////////////////////////////////
  onHTTPMessage: function(request, response) {
    var msg = '';
    log.info('New message from ' + request.url);
    var _url = url.parse(request.url);

    // Check router existance
    if (this.routers[_url.pathname]) {
      log.debug('Yeah!, router found !');
      this.routers[_url.pathname](_url, request, response, this.cb);
    } else {
      response.setHeader('Content-Type', 'text/html');
      response.statusCode = 404;
      response.write('Not found');
      log.warn('Bad query ' + request.url + ', router not found');
    }
    return response.end();
  }
};

// Exports
exports.ListenerHttp = ListenerHttp;
