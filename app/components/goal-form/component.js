import Ember from 'ember';
import moment from 'moment';

const {
  Component,
  isEmpty,
  inject: { service },
  computed,
  get,
  set,
  setProperties
} = Ember;

export default Component.extend({
  toast: service(),
  store: service(),

  saving: false,
  currentStep: 'startGoal',
  minDueDate: moment.utc().add(1, 'days').startOf('day'),

  metrics: computed('changeset.type', 'model.metrics.[]', function () {
    const metrics = get(this, 'model.metrics');
    const changeset = get(this, 'changeset');
    const type = get(changeset, 'type');
    return metrics.filterBy('type.id', get(type, 'id'));
  }),

  init(){
    this._super(...arguments);
    setProperties(this, {
      'changeset.type': get(this, 'model.types').findBy('id', get(this, 'model.goal.type.id')),
      'changeset.metric': get(this, 'model.metrics').findBy('id', get(this, 'model.goal.metric.id')),
      'changeset.socialAccount': get(this, 'model.socialAccounts').findBy('id', get(this, 'model.goal.socialAccount.id')),
    });
  },

  actions: {
    goToStep(step) {
      const component = this;
      const changeset = get(this, 'changeset');
      const currentStep = get(this, 'currentStep');
      changeset.validate().then(() => {
        if (get(changeset, 'isInvalid')) {
          const error = changeset.get('error');
          // changeset is not valid
          if (!((currentStep === 'startGoal' && !isEmpty(error.type)) ||
            (currentStep !== 'startGoal' && currentStep !== 'finishGoal' && !isEmpty(error.metric)) ||
            (currentStep === 'finishGoal' && (!isEmpty(error.amount) || !isEmpty(error.endDate))))) {
            // move to new step
            set(this, 'currentStep', step);
          }
        } else if (get(changeset, 'isValid') && currentStep === 'finishGoal') {
          set(component, 'saving', true);
          changeset.save().then(() => {
            get(this, 'toast').success('Goal saved successfully!', 'Success');
            component.transitionTo('brand.edit.goals');
          }).finally(() => set(component, 'saving', false));
        } else if (get(changeset, 'isValid')) {
          // move to new step
          set(this, 'currentStep', step);
        }
      });
    }
  }
});
