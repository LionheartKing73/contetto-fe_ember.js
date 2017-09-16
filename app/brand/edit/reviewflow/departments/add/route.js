import Ember from 'ember';
import departmentValidations from 'contetto/validations/department';
import departmentMemberValidations from 'contetto/validations/department-member';
import BrandAuthorization from 'contetto/mixins/brand-authorization';
import lookupValidator from 'ember-changeset-validations';
import Changeset from 'ember-changeset';

const {
  Route,
  get,
  RSVP: {
    hash,
    all
  }
} = Ember;

export default Route.extend(BrandAuthorization, {
  authorizationAttribute: 'manageReviewStructure',
  authorizationFailedRoute: 'brand.edit.reviewflow.departments.list',

  model() {
    const brand = this.modelFor('brand.edit');
    const newDepartment = this.store.createRecord('department', {
      title: "",
      brand: brand
    });

    return hash({
      departmentValidations,
      departmentMemberValidations,
      members: brand.get('brandMembers').then((member) => {
        return all(member.mapBy('user'));
      }),
      department: newDepartment,
      duties: this.store.findAll('duty'),
      departmentMembers: [],
      changeset: new Changeset(newDepartment, lookupValidator(departmentValidations), departmentValidations)
    });
  },
  deactivate() {
    if (get(this.currentModel, 'department.isNew')) {
      this.currentModel.department.destroyRecord();
    }
  },


  actions: {
    willTransition: function(transition) {
      let dirtyDeptMems = false;
      this.get("currentModel.departmentMembers").forEach((member) => {
        if (member.get("isDirty")) {
          dirtyDeptMems = true;
          return;
        }
      });
      if (!this.currentModel.changeset.get("isDirty") && !dirtyDeptMems) {
        return true;
      } else if (confirm("Your information will be lost, if you exit this page. Are you sure?")) {
        return true;
      } else {
        transition.abort();
      }
    },
    addMember() {
      let newMember = this.store.createRecord('department-member', {
        user: null
      });

      let validator = get(this, 'currentModel.departmentMemberValidations');
      let changeset = new Changeset(newMember, lookupValidator(validator), validator);
      get(this, 'currentModel.departmentMembers').pushObject(changeset);
    },

    removeMember(member) {
      get(this, 'currentModel.departmentMembers').removeObject(member);
    },
    onSave() {
      this.transitionTo('brand.edit.reviewflow.departments');
    }
  }
});
