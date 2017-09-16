import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
    return (serialized === 1) ? true : false;

  },

  serialize(deserialized) {
    return (deserialized) ? 1 : -1;
  }
});
