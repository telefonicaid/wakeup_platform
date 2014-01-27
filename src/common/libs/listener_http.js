/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var config = process.configuration,
    log = require('./logger'),
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
    log.debug('onHTTPMessage: Received Headers: ', request.headers);

    var msg = '';
    if (request.headers['x-client-cert-verified'] !== 'SUCCESS') {
      log.error('Received certificate not accepted by SSL terminator !');
      response.setHeader('Content-Type', 'text/plain');
      response.statusCode = 400;
      response.write('Client certificate not accepted');
      response.end();
      return;
    }
    log.info('New message to ' + request.url + ' from ' +
      request.headers['x-client-cert-dn']);

    var _url = url.parse(request.url);

    // Check router existance
    if (this.routers[_url.pathname]) {
      log.debug('Yeah!, router found !');
      var body = '',
          self = this;
      request.on('data', function(data) {
        body += data;
      });
      request.on('end', function() {
        self.routers[_url.pathname](_url, body, request, response, self.cb);
        response.end();
      });
    } else {
      response.setHeader('Content-Type', 'text/plain');
      response.statusCode = 404;
      response.write('Not found');
      log.warn('Bad query ' + request.url + ', router not found');
      response.end();
    }
  }
};

// Exports
exports.ListenerHttp = ListenerHttp;
