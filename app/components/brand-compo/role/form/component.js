import Ember from 'ember';

const {
  Component,
  set,
  get,
  inject: {
    service
  }
} = Ember;

export default Component.extend({
  toast: service(),

  inboxPermissions: [{
    id: 'manage',
    name: 'Manage Inbox'
  }, {
    id: 'view',
    name: 'View Inbox'
  }, {
    id: 'none',
    name: 'No Access'
  }],
  disableSave: Ember.computed.or('changeset.isInvalid', 'isSubmitted'),
  inboxPermission: Ember.computed('changeset.manageInbox', 'changeset.viewInbox', {
    get(key) {
      if (get(this, 'changeset.manageInbox')) {
        return {
          id: 'manage',
          name: 'Manage Inbox'
        };
      }
      else if (get(this, 'changeset.viewInbox')) {
        return {
          id: 'view',
          name: 'View Inbox'
        };
      }
      else {
        return {
          id: 'none',
          name: 'No Access'
        };
      }
    },

    set(key, value) {
      if (value.id === 'manage') {
        set(this, 'changeset.manageInbox', true);
        set(this, 'changeset.viewInbox', true);
      }
      else if (value.id === 'view') {
        set(this, 'changeset.manageInbox', false);
        set(this, 'changeset.viewInbox', true);
      }
      else {
        set(this, 'changeset.manageInbox', false);
        set(this, 'changeset.viewInbox', false);
      }

      return value;
    }
  }),
  actions: {
    addRole(changeset) {
      changeset.validate().then(() => {
        if (get(changeset, 'isInvalid')) {
          return;
        }

        set(this, 'isSubmitted', true);

        changeset.save().then(() => {
          get(this, 'toast').success('Role has been added successfully');
          this.transitionTo('brand.edit.team.roles'); //Redirect to roles list upon adding
        }).finally(() => {
          set(this, 'isSubmitted', false);
        });
      });
    }
  }
});
