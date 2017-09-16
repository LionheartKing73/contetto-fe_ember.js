import Ember from 'ember';

const {
  Component,
  set,
  get
} = Ember;

export default Component.extend({
  actions: {
    onSave(dept) {
      this.onSave(dept);
    },
    addMember() {
      this.addMember();
    },
    removeMember(member) {
      this.removeMember(member);
    }
  }
});
