/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
    emberFullCalendar: {
      scheduler: false
    },

    sassOptions: {
      includePaths: [
        'app/styles',
        'node_modules/breakpoint-sass/stylesheets',
        'node_modules/breakpoint-slicer/stylesheets'
      ]
    }
  });

  app.import('vendor/ember/ember-template-compiler.js');

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.
  app.import('vendor/stylesheets/font-awesome.css');

  app.import('node_modules/perfect-scrollbar/dist/perfect-scrollbar.css');

  // importing At.js for chat-mentions
  app.import('bower_components/At.js/dist/js/jquery.atwho.js');
  app.import('bower_components/At.js/dist/css/jquery.atwho.css');
  return app.toTree();
};
