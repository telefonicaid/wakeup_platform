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
    sandman_udp = require('./sandmans/udp'),
    sandman_tcp = require('./sandmans/tcp');

// Load wakeup sandmans
var sandmans = {};
(function load_sandmans() {
  log.debug('WU_Sender: Loading sandmans ...');
  sandmanModules = fs.readdirSync('modules/sandmans');
  sandmanModules.forEach(function(filename) {
    if (filename.substr(-2) === 'js') {
      try {
        var sandman = require('./sandmans/' + filename);
        if (sandman.info && sandman.info.protocol) {
          log.debug('WU_Sender::load_sandmans - Loaded sandman ' +
            filename + ' for protocol: ' + sandman.info.protocol);
          if (sandman.info.description) {
            log.debug('WU_Sender::load_sandmans - INFO: ' +
              sandman.info.protocol + ' = ' + sandman.info.description);
          }
          sandmans[sandman.info.protocol] = sandman.sandman;
        }
      } catch (e) {
        log.debug('WU_Sender::load_sandmans - Not valid sandman ' +
          filename);
      }
    }
  });
}());

function wakeup_sender() {
}

wakeup_sender.prototype = {
  wakeup: function _wakeup(ip, port, protocol) {
    log.debug('WU_Sender::wakeup => ' + ip + ':' + port + ' through ' +
      protocol);
    var message = new Buffer('NOTIFY ' + ip + ':' + port);

    if (sandmans[protocol]) {
      sandmans[protocol](ip, port, message);
    } else {
      log.error('Protocol (' + protocol + ') not supported');
    }
  }
};

var wusender = new wakeup_sender();
function getWakeUpSender() {
  return wusender;
}
module.exports = getWakeUpSender();
