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
  changePlan: inject.service(),
  ajax: inject.service(),
  planUpgrading: Ember.computed(function(){
    this.get('ajax').request(`https://gke.contetto.io/billing/v1/upgradePlanDetails?subscription=${this.get('subscription.id')}&plan=${this.get('newPlan.id')}`).then((response) => {
      console.log(response);
    });
    return this.get('changePlan').isUpgrading(this.get('subscription'), this.get('newPlan'));
  }),
  planDowngrading: Ember.computed(function(){
    return this.get('changePlan').isDowngrading(this.get('subscription'), this.get('newPlan'));
  }),
  planChangingPeriod: Ember.computed(function(){
    return this.get('changePlan').isChangingPeriod(this.get('subscription'), this.get('newPlan'));
  })
});
