import Ember from 'ember';

const {
  Component,
  set,
  get,
  inject,
  getProperties
} = Ember;

export default Component.extend({
  toast: inject.service(),
  store: inject.service(),
  session: inject.service(),
  actions: {
    accept(invite) {
      const {
        role,
        user,
        brand
      } = getProperties(invite, 'role', 'user', 'brand');
      set(invite, 'status', 'accept');
      this.get("store").fetchRecord("user", this.get("session.data.authenticated.userId")).then((user) => {
        set(invite, 'user', user);
        set(invite, 'userExist', true);
        invite.save().then(() => {
          /*  get(this, 'store').createRecord('brandMember', {
              role,
              user,
              brand
            }).save().then(() => {*/
          get(this, 'toast').success('Invitation Accepted!');
          /* });*/
        });
      });
    },
    reject(invite) {
      set(invite, 'status', 'reject');
      invite.save().then(() => get(this, 'toast').success('Invitation Rejected!'));
    },
    select(brand) {
      this.get('session').invalidate();
    }
  }
}).reopenClass({
  positionalParams: ['invite']
});
