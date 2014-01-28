/* jshint node: true */
/**
 * Wake Up Platform
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var log = require('./logger'),
    fs = require('fs');

module.exports = (function PluginsLoader() {
  var plugins = {};

  function load(relative_path) {
    var path = process.cwd() + '/' + relative_path + '/';

    log.debug('WU_PluginsLoader: Loading plugins located on ' + path);
    var pluginsModules = fs.readdirSync(path);
    for (var i = 0; i < pluginsModules.length; i++) {
      var filename = pluginsModules[i];
      if (filename.substr(-2) === 'js') {
        try {
          var plugin = require(path + filename);
          if (plugin.info && plugin.info.name && plugin.info.type &&
              plugin.entrypoint && typeof(plugin.entrypoint) === 'function') {

            if (!plugins[plugin.info.type]) {
              plugins[plugin.info.type] = {};
            }
            plugins[plugin.info.type][plugin.info.name] = {
              info: plugin.info,
              entrypoint: plugin.entrypoint
            };

            log.debug('WU_PluginsLoader::load - Loaded plugin ' +
              filename + ' - ' + plugin.info.name + ' (' + plugin.info.type +
              ')');
            if (plugin.info.description) {
              log.debug('WU_PluginsLoader::load - INFO: /' +
                plugin.info.name + ' = ' + plugin.info.description);
            }
          } else {
            log.error('JARL');
          }
        } catch (e) {
          log.debug('WU_PluginsLoader::load - Not valid plugin ' +
            filename);
        }
      }
    }
  }

  return {
    load: function load_plugins(relative_path) {
      load(relative_path);
    },

    getByType: function get_plugins_bytype(type) {
      return plugins[type];
    },

    // Recover HTTP routers
    getRouters: function get_routers() {
      this.routers = {};
      var pluginsRouters = this.getByType('router');

      var self = this;
      Object.keys(pluginsRouters).forEach(function(routerId) {
        if (pluginsRouters[routerId].info.virtualpath) {
          self.routers['/' + pluginsRouters[routerId].info.virtualpath] =
            pluginsRouters[routerId].entrypoint;

          log.debug('WU_PluginsLoader::get_routers - Loaded router ' +
            pluginsRouters[routerId].info.name + ' - on virtualpath: /' +
            pluginsRouters[routerId].info.virtualpath);

          if (pluginsRouters[routerId].info.description) {
            log.debug('WU_PluginsLoader::get_routers - INFO: /' +
              pluginsRouters[routerId].info.virtualpath + ' = ' +
              pluginsRouters[routerId].info.description);
          }

          if (Array.isArray(pluginsRouters[routerId].info.alias)) {
            log.debug('WU_PluginsLoader::get_routers - Loading aliases ...');
            pluginsRouters[routerId].info.alias.forEach(function(alias) {
              log.debug('WU_PluginsLoader::get_routers - Alias /' + alias +
                ' = /' + pluginsRouters[routerId].info.virtualpath);
              self.routers['/' + alias] = pluginsRouters[routerId].entrypoint;
            });
          }
        }
      });

      return this.routers;
    },

    // Recover Sandmans (WakeUp plugins)
    getSandmans: function get_sandmans() {
      this.sandmans = {};
      var pluginsSandmans = this.getByType('sandman');

      var self = this;
      Object.keys(pluginsSandmans).forEach(function(sandmanId) {
        if (pluginsSandmans[sandmanId].info.protocol) {
          self.sandmans[pluginsSandmans[sandmanId].info.protocol] =
            pluginsSandmans[sandmanId].entrypoint;

          log.debug('WU_PluginsLoader::get_sandmans - Loaded sandman ' +
            pluginsSandmans[sandmanId].info.name + ' for protocol: ' +
            pluginsSandmans[sandmanId].info.protocol);

          if (pluginsSandmans[sandmanId].info.description) {
            log.debug('WU_PluginsLoader::get_sandmans - INFO: /' +
              pluginsSandmans[sandmanId].info.protocol + ' = ' +
              pluginsSandmans[sandmanId].info.description);
          }
        }
      });

      return this.sandmans;
    }
  };
})();
