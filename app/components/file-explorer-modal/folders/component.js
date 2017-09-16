import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    selectFolder(folder) {
      this.get("select")(folder);
    }
  }
});
