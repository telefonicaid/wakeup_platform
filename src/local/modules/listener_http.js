/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var config = require('../config.default.json'),
    log = require('../shared_libs/logger')(config.log4js),
    fs = require('fs'),
    url = require('url');

// Load HTTP routers
var routers = {};
(function load_routers() {
  log.debug('WU_ListenerHTTP: Loading routers ...');
  routerModules = fs.readdirSync('local/modules/routers');
  routerModules.forEach(function(filename) {
    if (filename.substr(-2) === 'js') {
      try {
        var router = require('./routers/' + filename);
        if (router.info && router.info.virtualpath) {
          log.debug('WU_ListenerHTTP::load_routers - Loaded router ' +
            filename + ' - on virtualpath: ' + router.info.virtualpath);
          if (router.info.description) {
            log.debug('WU_ListenerHTTP::load_routers - INFO: ' +
              router.info.description);
          }
          routers['/' + router.info.virtualpath] = router.router;
        }
      } catch(e) {
        log.debug('WU_ListenerHTTP::load_routers - Not valid router ' +
          filename);
      }
    }
  });
}());

function listener_http(ip, port, ssl, callback) {
  if (typeof(callback) != 'function') {
    callback = function() {
      log.fatal('WU_ListenerHTTP: No wakeup callback method defined !');
    };
  }
  this.ip = ip;
  this.port = port;
  this.ssl = ssl;
  this.cb = callback;
}

listener_http.prototype = {
  init: function() {
    log.info('Starting WakeUp listener_http');

    // Create a new HTTP(S) listener_http
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
             ' WakeUp listener_http starting on ' + this.ip + ':' + this.port);
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

    // By default -> about page
    if (_url.pathname === '/') {
      _url.pathname = '/about';
    }

    // Check router existance
    if (routers[_url.pathname]) {
      routers[_url.pathname](_url, request, response, this.cb);
      log.debug('Yeah!, router found !');
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
exports.listener_http = listener_http;
