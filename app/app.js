import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  customEvents: {
    paste: "paste"
  },
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,

  engines: {
    contettoDashboardCharts: {
      dependencies: {
        services: [
          'store',
          'session',
          'ajax'
        ]
      }
    }
  }
});

loadInitializers(App, config.modulePrefix);

export default App;
