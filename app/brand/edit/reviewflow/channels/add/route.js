import Ember from 'ember';
import BrandAuthorization from 'contetto/mixins/brand-authorization';
import ReviewChannelValidations from 'contetto/validations/reviewchannel';
import departmentValidations from 'contetto/validations/department';
import departmentMemberValidations from 'contetto/validations/department-member';
import channelStepValidations from 'contetto/validations/channel-step';
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
  authorizationFailedRoute: 'brand.edit.reviewflow.channels.list',

  model() {
    const brand = this.modelFor('brand.edit');
    var channel = this.store.createRecord('reviewChannel', {
      brand: brand
    });
    const newDepartment = this.store.createRecord('department', {
      title: "",
      brand: brand
    });
    return Ember.RSVP.hash({
      brand: brand,
      ReviewChannelValidations,
      channelStepValidations,
      channel,
      steps: [],
      changeset: new Changeset(channel, lookupValidator(ReviewChannelValidations), ReviewChannelValidations),
      department: Ember.RSVP.hash({
        departmentValidations,
        departmentMemberValidations,
        members: brand.get('brandMembers').then((member) => {
          return Ember.RSVP.all(member.mapBy('user'));
        }),
        department: newDepartment,
        duties: this.store.findAll('duty'),
        departmentMembers: [],
        changeset: new Changeset(newDepartment, lookupValidator(departmentValidations), departmentValidations)
      })
    });
  },

  nextOrder: function() {
    return get(this, 'currentModel.steps.length') + 1;
  },
  deactivate: function() {
    var model = this.get("currentModel.channel");
    if ((model.get('isNew') || model.get('isDirty')) && (!model.get('isSaving'))) {
      model.rollbackAttributes();
    }
  },
  actions: {
    willTransition: function(transition) {
      let dirtySteps = false;
      this.get("currentModel.steps").forEach((step) => {
        if (step.get("isDirty")) {
          dirtySteps = true;
          return;
        }
      });
      if (!this.currentModel.changeset.get("isDirty") && !dirtySteps) {
        return true;
      } else if (confirm("Your information will be lost, if you exit this page. Are you sure?")) {
        return true;
      } else {
        transition.abort();
      }
    },
    addStep() {
      let newStep = this.store.createRecord('channel-step', {
        order: this.nextOrder()
      });

      let validator = get(this, 'currentModel.channelStepValidations');
      let changeset = new Changeset(newStep, lookupValidator(validator), validator);
      get(this, 'currentModel.steps').pushObject(changeset);
    },

    removeStep(step) {
      get(this, 'currentModel.steps').removeObject(step);
    },
    addMember() {
      let newMember = this.store.createRecord('department-member', {
        user: null
      });

      let validator = get(this, 'currentModel.department.departmentMemberValidations');
      let changeset = new Changeset(newMember, lookupValidator(validator), validator);
      get(this, 'currentModel.department.departmentMembers').pushObject(changeset);
    },
    removeMember(member) {
      get(this, 'currentModel.department.departmentMembers').removeObject(member);
    }
  }
});
