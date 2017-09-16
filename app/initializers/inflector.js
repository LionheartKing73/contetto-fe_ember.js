import Ember from 'ember';


export function initialize(/* application */) {
  const inflector = Ember.Inflector.inflector;

  inflector.irregular('audiences-data', 'audiences-data');
}

export default {
  name: 'inflector',
  initialize
};
