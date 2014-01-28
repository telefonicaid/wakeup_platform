/* jshint node: true */
/**
 * PUSH Notification server
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var config = require('./shared_libs/configuration'),
    log = require('./shared_libs/logger'),
    plugins_loader = require('./shared_libs/plugins_loader'),
    mn = require('./libs/mobile_networks'),
    request = require('request');
    ListenerHttp = require('./shared_libs/listener_http').ListenerHttp;

function WU_Global_Server() {
  this.http_listeners = [];
}

WU_Global_Server.prototype = {
  onWakeUpCommand: function(wakeupdata) {
    function onNetworkChecked(error, networkdata) {
      if (error) {
        log.error('Bad network: ' + error);
        return;
      }
      var URL = networkdata.host + '/wakeup?ip=' + wakeupdata.ip +
        '&port=' + wakeupdata.port;
      if (wakeupdata.proto) {
        URL += '&proto=' + wakeupdata.proto;
      }
      log.info('Sending wakeup query to: ' + URL);

      request({
        url: URL,
        headers: {
          'x-real-ip': wakeupdata.headers['x-real-ip'],
          'x-forwarded-for': wakeupdata.headers['x-forwarded-for'],
          'x-client-cert-dn': wakeupdata.headers['x-client-cert-dn'],
          'x-client-cert-verified': wakeupdata.headers['x-client-cert-verified']
        }
      }, function(error, resp, body) {
        if (error) {
          log.error('Local node connection error: ' + error);
          return;
        }
        log.info('Notification delivered to local node ! - Response: (' +
          resp.statusCode + ') # ' + body);
      });
    }

    if (wakeupdata.netid) {
      mn.checkNetwork(wakeupdata.netid, wakeupdata.ip, onNetworkChecked);
    } else {
      mn.checkNetwork({mcc: wakeupdata.mcc, mnc: wakeupdata.mnc},
        wakeupdata.ip, onNetworkChecked);
    }
  },

  start: function() {
    // Start servers
    plugins_loader.load('routers');
    for (var a in config.interfaces) {
      this.http_listeners[a] = new ListenerHttp(
        config.interfaces[a].ip,
        config.interfaces[a].port,
        config.interfaces[a].ssl,
        plugins_loader.getRouters(),
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

