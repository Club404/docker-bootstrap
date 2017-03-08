// Including required files

// Define the main application
const app = {
  init: function () {
    console.log('Hello World from app...!');
  }
};

// Bootstrap an angular app
angular
  .module('app', [
    'ngAnimate',
    'ngMaterial',
  ])
  .constant('app.config', {
    catalog: {
      url: '/api/consul/v1/catalog/services?stale=&wait=60000ms'
    },
    theme: {
      primary: 'blue-grey',
      accent: 'amber'
    },
  })
  .config([
    'app.config',
    '$mdThemingProvider',
    function (config, $mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette(config.theme.primary || 'teal')
        .accentPalette(config.theme.accent || 'amber');
    }
  ])
  .run([
    'app.config',
    '$rootScope',
    '$http',
    function (config, $rootScope, $http) {
      // Define the scope variables
      $rootScope.status = 'loading';
      $rootScope.config = config;
      $rootScope.catalog = {};
      $rootScope.apps = [];
      $rootScope.apis = [];

      // Retrieve the catalog of micro services
      $http
        .get(config.catalog.url)
        .then(function (response) {
          // Process and cache the results
          if (response.data) {
            var apps = [];
            var apis = [];
            var data = response.data;
            for (var key in data) {
              var item = data.hasOwnProperty(key) ? data[key] : null;
              if (item.length) {
                // Process the tags to find apps and services
                item.forEach(function (tag) {
                  var parts = tag.split(':');
                  var index = parts.length > 0 ? parts[0] : null;
                  var value = parts.length > 1 ? parts[1] : null;
                  var options = value ? value.split('/') : null;
                  if (options && options.length) {
                    // Define the extended options
                    options = {
                      port: parseInt(options[0]),
                      args: options.length > 1 ? options[1] : null
                    };

                    // For tags specifying a port, filter on suffixed port number
                    var match = options.port ? /([\w|-]+)(-)(\d+)/i.exec(key) : null;
                    if (match && match.length >= 4) {
                      if (match[3] == options.port.toString()) {
                        // Matches the specified port number, strip suffix
                        key = match[1];
                      } else {
                        // Different port number specified, skip...
                        index = null;
                      }
                    }
                  } else {
                    // No options available
                    options = {};
                  }

                  if (index === 'app') {
                    apps.push({
                      name: key,
                      opts: options,
                      tags: item
                    })
                  }
                  if (index === 'api') {
                    apis.push({
                      name: key,
                      opts: options,
                      tags: item
                    })
                  }
                });
              }
            }
            $rootScope.catalog = data;
            $rootScope.apps = apps;
            $rootScope.apis = apis;
            $rootScope.status = 'done';
          }
        })
        .catch(function () {
          $rootScope.status = 'error';
        });
    }
  ]);
