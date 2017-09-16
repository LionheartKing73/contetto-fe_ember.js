import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    selectFile(file) {
      this.get("select")(file);
    }
  }
});
