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
  planPayment: inject.service(),
  changePlan: inject.service(),
  planUpgrading: computed(function(){
    return this.get('changePlan').isUpgrading(this.get('subscription'), this.get('newPlan'));
  }),
  planDowngrading: computed(function(){
    return this.get('changePlan').isDowngrading(this.get('subscription'), this.get('newPlan'));
  }),
  totalDays: computed(function(){
    return this.get('planPayment').totalDays(this.get('newPlan'));
  }),
  prorationDays: computed(function(){
    return this.get('planPayment').prorationDays();
  }),
  priceDiff: computed(function(){
    return (this.get('newPlan.price')-this.get('subscription.plan.price')).toFixed(2);
  }),
  outstandingPlanPrice: computed(function(){
    return this.get('planPayment').outstandingPlanPrice(this.get('newPlan'), this.get('subscription'));
  }),
  discountOnOutstandingPlanPrice: computed(function(){
    return this.get('planPayment').discountOnOutstandingPlanPrice(this.get('newPlan'), this.get('subscription'));
  }),
  couponedOutstandingPlanPrice: computed(function(){
    return this.get('planPayment').couponedOutstandingPlanPrice(this.get('newPlan'), this.get('subscription'));
  }),
  actions: {
    cancelConfirmPlan() {
      this.set('confirmPlan', false);
    },
    payPlan(){
      if(this.get('company.isTrial')){
        this.set('subscription.plan', this.get('newPlan'));
        this.get('subscription').save().then((s) => {
          this.get('toast').success('Plan upgraded successfully.');
          this.get('subscription').reload();
          this.set('confirmPlan', false);
        });
      }
      else{
        this.get('planPayment').payPlan(this.get('subscription'), this.get('newPlan')).then((response) => {
          this.get('toast').success('Plan upgraded successfully.');
          this.get('subscription').reload();
          this.set('confirmPlan', false);
        }).catch((error) => {
          this.get('toast').error("Some error occured and plan couldn't be upgraded");
        });
      }
    }
  }
});
