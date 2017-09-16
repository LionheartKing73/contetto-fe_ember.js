/* global require:false */

const importComponents = [
  'date-display',
];

const emberBootstrapTableComponents = [
  'eb-pagination',
  'eb-remote-table',
  'eb-table-body',
  'eb-table-column',
  'eb-table-content',
  'eb-table-footer',
  'eb-table-header-column',
  'eb-table-header-row',
  'eb-table-header',
  'eb-table-navbar',
  'eb-table-row',
  'eb-table'
];

export default {
  initialize(applicationInstance) {
    importComponents.forEach(componentName => {
      const component = require(`contetto/components/${componentName}/component`).default;
      const layout = require(`contetto/components/${componentName}/template`).default;
      component.reopen({
        layout
      });

      applicationInstance.register(`component:${componentName}`, component, {singleton: false});
    });

    emberBootstrapTableComponents.forEach(componentName => {
      const component = require(`ember-bootstrap-table/components/${componentName}`).default;

      applicationInstance.register(`component:${componentName}`, component, {singleton: false});
    });
  }
};
