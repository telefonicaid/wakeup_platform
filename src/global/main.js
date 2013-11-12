/* jshint node: true */
/**
 * PUSH Notification server
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var config = require('./config.default.json'),
    log = require('./shared_libs/logger')(config.log4js),
    routers_loader = require('./shared_libs/load_routers');
    listener_http = require('./shared_libs/listener_http').listener_http;

function WU_Global_Server() {
  this.http_listeners = [];
}

WU_Global_Server.prototype = {
  onWakeUpCommand: function(data) {
    log.error('TO BE DONE ' + JSON.stringify(data));
  },

  start: function() {
    // Start servers
    var routers = routers_loader('routers');
    for (var a in config.interfaces) {
      this.http_listeners[a] = new listener_http(
        config.interfaces[a].ip,
        config.interfaces[a].port,
        config.interfaces[a].ssl,
        routers,
        this.onWakeUpCommand);
      this.http_listeners[a].init();
    }

    log.info('WakeUp global server starting');
  },

  stop: function() {
    log.info('WakeUp global server stopping');

    this.http_listeners.forEach(function(server) {
      server.stop();
    });

    log.info('WakeUp global server waiting 10 secs for all servers stops ...');
    setTimeout(function() {
      log.info('WakeUp global server - Bye !');
      process.exit(0);
    }, 10000);
  }
};

exports.WU_Global_Server = WU_Global_Server;
