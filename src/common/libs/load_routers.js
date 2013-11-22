/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var config = process.configuration;
var log = require('./logger')(config.log4js),
    fs = require('fs');

// Load HTTP routers
module.exports = function load_routers(relative_path) {
  var routers = {};
  var path = process.cwd() + '/' + relative_path + '/';

  log.debug('WU_RoutersLoader: Loading routers on ' + path);
  var routerModules = fs.readdirSync(path);
  for (var i = 0; i < routerModules.length; i++) {
    var filename = routerModules[i];
    if (filename.substr(-2) === 'js') {
      try {
        var router = require(path + filename);
        if (router.info && router.info.virtualpath) {
          log.debug('WU_RoutersLoader::load_routers - Loaded router ' +
            filename + ' - on virtualpath: /' + router.info.virtualpath);
          if (router.info.description) {
            log.debug('WU_RoutersLoader::load_routers - INFO: /' +
              router.info.virtualpath + ' = ' + router.info.description);
          }
          routers['/' + router.info.virtualpath] = router.router;
          if (Array.isArray(router.info.alias)) {
            log.debug('WU_RoutersLoader::load_routers - Loading aliases ...');
            router.info.alias.forEach(function(alias) {
              log.debug('WU_RoutersLoader::load_routers - Alias /' + alias +
                ' = /' + router.info.virtualpath);
              routers['/' + alias] = router.router;
            });
          }
        }
      } catch (e) {
        log.debug('WU_RoutersLoader::load_routers - Not valid router ' +
          filename);
      }
    }
  }

  return routers;
};
