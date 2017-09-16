import Ember from 'ember';
import channelStepValidations from 'contetto/validations/channel-step';

const {
  Component,
  inject: { service },
  get, set,
  computed
} = Ember;

export default Component.extend({
  store: service('store'),
  stepSort: ['order:asc'],
  hasErrors: false,

  sortedSteps: computed.sort('model.steps', 'stepSort'),

  reorder: function() {
    var order = 1;
    this.get("sortedSteps").map(function(step) {
      step.set('order', order);
      order++;
    });
  },

  doRemoveStep: function(step) {
    this.removeStep(step);
    this.reorder();
  },

  validate(changeset) {
    const changesets = [changeset];

    changesets.pushObjects(get(this, 'model.steps'));

    // FIXME: Need to reset steps errors to make sure
    // the validation happens again for steps.
    delete changeset.get('_errors')['steps']

    return new Ember.RSVP.Promise((resolve, reject) => {
      return Ember.RSVP.all(changesets.map((c) => c.validate() )).then(() => {
        if (!changesets.isAny('isInvalid')) {
          return this.validateStepCount(changeset).then(() => {
            return this.validateDepartmentUniqueness(changeset, get(this, 'model.steps')).then(() => {
              resolve();
            }, () => {
              reject();
            });
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

  validateStepCount(changeset) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (!get(this, 'model.steps.length') > 0) {
        changeset.pushErrors('steps', "Need to have atleast one step");
        return reject();
      }

      return resolve();
    });
  },

  validateDepartmentUniqueness(changeset, steps) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (get(steps, 'length') !== steps.mapBy('department.id').uniq().length) {
        changeset.pushErrors('steps', "Each step needs to have a different department");
        return reject();
      }

      return resolve();
    });
  },

  actions: {
    addStep: function() {
      let self = this;
      this.get('changeset').validate().then(() => {
        if (self.get('changeset.isInvalid')) {
          return;
        }
      });
      if(!this.get('changeset.name') || !this.get('changeset.name').trim()){
        this.get('toast').error('Please enter a valid name');
      }
      else{
        this.addStep();
      }
    },
    removeStep: function(step) {
      if (this.get('editing') == 'editing') {
        if (confirm("Any posts that are currently in this review step will be marked as approved by this step.")) {
          this.doRemoveStep(step);
        }
      }
      else {
        if (confirm("Remove this step?")) {
          this.doRemoveStep(step);
        }
      }
    },
    save: function(changeset) {
      let self = this;
      changeset.validate().then(() => {
        if (changeset.get('isInvalid')) {
          return;
        }

        changeset.save().then((channel) => {
          let steps = get(this, 'model.steps');

          let removedSteps = get(this, 'model.removedSteps') || [];

          removedSteps = removedSteps.map((step) => {
            step.deleteRecord();
            return step;
          });

          steps.pushObjects(removedSteps);

          Ember.RSVP.all(steps.map(function(step) {
            step.set("reviewChannel", self.get('model.channel'));
            return step.save();
          })).then(() => {
            this.get('toast').success('Channel saved successfully!', 'Success');
            this.transitionTo('brand.edit.reviewflow.channels');
          });
        });
      });
    },
    addMember(){
      this.addMember();
    },
    removeMember(member){
      this.removeMember(member);
    }
  }
});
