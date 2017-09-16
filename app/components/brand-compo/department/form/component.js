import Ember from 'ember';

const {
  Component,
  get,
  set,
  computed,
  inject: {
    service
  },
} = Ember;

export default Component.extend({
  toast: service(),
  prevChangeset: null,

  validate(changeset) {
    const changesets = [changeset];

    changesets.pushObjects(get(this, 'model.departmentMembers'));

    // FIXME: Need to reset departmentMembers errors to make sure
    // the validation happens again for departmentMembers.
    delete changeset.get('_errors')['departmentMembers']

    return new Ember.RSVP.Promise((resolve, reject) => {
      return Ember.RSVP.all(changesets.map((c) => c.validate())).then(() => {
        if (!changesets.isAny('isInvalid')) {
          return this.validateManager(changeset).then(() => {
            resolve();
          }, () => {
            reject();
          })
        } else {
          // FIXME: Need to return the reason for rejection.
          // For now, the template will take care of displaying the
          // error message. since, ember-changeset will update the
          // `errors` attribute of the changeset with appropriate
          // messages.
          reject();
        }
      });
    });
  },

  validateManager(changeset) {
    if (get(this, 'model.department.manager.id') !== get(this, 'manager.id')) {
      get(this, 'model.departmentMembers').setEach('isManager', false);
      set(get(this, 'manager'), 'isManager', true);
    }

    const departmentMembers = get(this, 'model.departmentMembers');

    return new Ember.RSVP.Promise((resolve, reject) => {
      var error = null;
      const managerLength = departmentMembers.filterBy('isManager', true).get('length');

      if (managerLength === 0) {
        error = "A manager is required!";
      } else if (managerLength > 1) {
        error = "There can be only one manager";
      }

      if (departmentMembers.get('length') === 0) {
        error = "You must add atleast one department member";
      }

      if (error) {
        changeset.pushErrors('departmentMembers', error);
        return reject();
      }

      return resolve();
    })
  },

  manager: computed({
    get() {
      return get(this, 'model.department.manager');
    },
    set(key, value) {
      return get(this, 'model.departmentMembers').findBy('id', value);
    }
  }),

  actions: {
    save(changeset) {
      this.validate(changeset).then(() => {
        set(this, 'isSaving', true);

        changeset.save()
          .then((dept) => {
            let members = get(this, 'model.departmentMembers');
            members.setEach('department', dept);

            let deletedMembers = get(this, 'model.deletedDepartmentMembers') || [];

            deletedMembers = deletedMembers.map((member) => {
              member.deleteRecord();
              return member;
            });

            members.pushObjects(deletedMembers);

            Ember.RSVP.all(members.map((member) => {
              return member.save();
            })).then(() => {
              get(this, 'toast').success('Department saved successfully!', 'Success');
              this.onSave(dept);
            });
          })
          .catch((e) => {
            get(this, 'toast').error('Unable to create department', 'Error');
          })
          .finally(() => {
            set(this, 'isSaving', false);
          });
      });
    },

    addMember() {
      this.addMember();
    },

    removeMember(member) {
      this.removeMember(member);
    }
  }
});
