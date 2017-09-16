import Ember from 'ember';

const {
  Component,
  computed,
  inject,
  set,
  get
} = Ember;

export default Component.extend({
  tagName: 'tr',

  session: inject.service(),

  userId: computed.oneWay('session.data.authenticated.userId'),

  member: computed.oneWay('model'),

  actions: {
    delete(member){
      if (confirm('Are you sure you want to remove that user ?')) {
        set(this, 'deleting', true);
        member.destroyRecord()
          .then(() => get(this, 'toast').success('User removed successfully!', 'Success'))
          .finally(() => set(this, 'deleting', false));
      }
    }
  }
});
