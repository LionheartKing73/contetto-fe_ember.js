import Ember from 'ember';

const {
  Component,
  get,
  set,
  isEmpty,
  inject,
  computed,
  RSVP,
  observer
} = Ember;

export default Component.extend({
  toast: inject.service(),
  changePlan: inject.service(),
  plansSort: ['price:asc'],
  sortedPlans: Ember.computed.sort('plans', 'plansSort'),
  init(){
    this._super(...arguments);
    this.set('newPlan', this.get('subscription.plan'));
  },
  actions: {
    confirmUpdatePlan() {
      let canChangePlan = this.get('changePlan').canChangePlan(this.get('subscription'), this.get('newPlan'));
      if(canChangePlan){
        this.set('confirmPlan', true);
      }
      else{
        this.get('toast').error('Unable to change plan because you have already crossed usage limits.')
      }
    },
    updateCurrentPlan(plan) {
      this.set('newPlan', plan);
    },
    cancelChanges() {
      this.set('newPlan', this.get('subscription.plan'));
    }

  }
});
