/* jshint node: true */
/**
 * PUSH Notification server
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var config = require('./config.default.json'),
    log = require('./shared_libs/logger')(config.log4js),
    listener_http = require('./modules/listener_http').listener_http,
    wakeup_sender = require('./modules/wakeup_sender');

function WU_Local_Server() {
  this.http_listeners = [];
}

WU_Local_Server.prototype = {
  onWakeUpCommand: function(data) {
    wakeup_sender.wakeup(data.ip, data.port, data.protocol);
  },

  start: function() {
    // Start servers
    for (var a in config.interfaces) {
      this.http_listeners[a] = new listener_http(
        config.interfaces[a].ip,
        config.interfaces[a].port,
        config.interfaces[a].ssl,
        this.onWakeUpCommand);
      this.http_listeners[a].init();
    }

    log.info('WakeUp local server starting');
  },

  stop: function() {
    log.info('WakeUp local server stopping');

    this.http_listeners.forEach(function(server) {
      server.stop();
    });

    log.info('WakeUp local server waiting 10 secs for all servers stops ...');
    setTimeout(function() {
      log.info('WakeUp local server - Bye !');
      process.exit(0);
    }, 10000);
  }
};

exports.WU_Local_Server = WU_Local_Server;

