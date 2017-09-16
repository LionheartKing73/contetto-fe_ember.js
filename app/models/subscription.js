import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import {
  belongsTo,
  hasMany
}
from 'ember-data/relationships';
import BillingMixin from '../mixins/subscription/billing';
import CountsMixin from '../mixins/subscription/counts';
import CouponMixin from '../mixins/subscription/coupon';
import AddonMixin from '../mixins/subscription/addon';
import PlanMixin from '../mixins/subscription/plan';
import DiscountMixin from '../mixins/subscription/discount';

export default Model.extend(BillingMixin, CountsMixin, CouponMixin, DiscountMixin, AddonMixin, PlanMixin, {
  proratedBillingPrice: attr('number'),
  proratedBillingDays: attr('number'),
  startDate: attr('utc-date'),
  endDate: attr('utc-date'),

  //this field marks the start of billing of current plan. This is updated only if recurrence billing or first time proration billing is applied. It is not updated for the upgradation.
  planValidTill: attr('utc-date'),
  //This field marks the start date of current plan.
  planStartDate: attr('utc-date'),



  type: attr('string'),
  isMonthly: Ember.computed('type', function(){
    return this.get('type')=="monthly";
  }),
  isYearly: Ember.computed('type', function(){
    return this.get('type')=="yearly";
  }),

  company: belongsTo('company'),
  plan: belongsTo('plan'),
  coupon: belongsTo('coupon'),
  card: belongsTo('card'),

  //This field tells the next plan if user selected to downgrade(within same plan tenure)
  nextDowngradedPlan: belongsTo('plan'),
  //This field tells the next plan if user selected to change(within different plan tenure)
  newPlan: belongsTo('plan'),
  //This field tells whether user has selected a plan change(downgrade/tenure change)
  planChange: Ember.computed('nextDowngradedPlan.id', 'newPlan.id', function(){
    return !!this.get('nextDowngradedPlan.id') || !!this.get('nextDowngradedPlan.newPlan.id')
  }),
  //This field returns the new changed plan if any
  changedPlan: Ember.computed('nextDowngradedPlan.id', 'newPlan.id', function(){
    if(this.get('nextDowngradedPlan.id')){
      return this.get('nextDowngradedPlan');
    }
    if(this.get('newPlan.id')){
      return this.get('newPlan');
    }
  }),

  addonItems: hasMany('addon-item', {
    inverse: 'subscription'
  }),
  downgradedAddons: hasMany('addon-item', {
    inverse: null
  })
});
