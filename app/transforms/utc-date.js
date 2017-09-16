import DS from 'ember-data';
import moment from 'moment';

export default DS.Transform.extend({
  deserialize(serialized) {
    if (serialized == null) {
      return null;
    }
    else {
      var m = moment(serialized);
      if (moment(serialized).isValid()) {
        return m;
      }
      else {
        return null;
      }

    }
  },

  serialize(deserialized) {
    if (moment(deserialized).isValid()) {
      return moment.utc(deserialized).format();
    }
    else {
      return null;
    }
  }
});
