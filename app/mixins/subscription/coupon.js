import Ember from 'ember';

export default Ember.Mixin.create({
    applyCoupon: Ember.inject.service(),
    couponApplicable: Ember.computed(function(){
      this.get('applyCoupon').couponApplicable(this);
    }),
    currentMonthApplied: Ember.computed('coupon.currentMonthApplied', function(){
      return !!this.get('coupon.currentMonthApplied');
    }),
    nextMonthAvailable: Ember.computed('coupon.nextMonthAvailable', function(){
      return !!this.get('coupon.nextMonthAvailable');
    }),
    couponedProratedPlanBill: Ember.computed('proratedPlanBill', 'coupon', function(){
      if(this.get('coupon.id')){
        if(this.get('coupon.amountType')){
          return this.get('applyCoupon').amountDiscount(this.get('coupon.amountOff'), this.get('proratedPlanBill'));
        }
        if(this.get('coupon.percentType')){
          return this.get('applyCoupon').percentDiscount(this.get('coupon.percentOff'), this.get('proratedPlanBill'));
        }
      }
      else{
        return this.get('proratedPlanBill');
      }
    }),
    couponedProratedAddonBill: Ember.computed('proratedAddonBill', 'coupon', function(){
      if(this.get('coupon.id') && this.get('coupon.billType')){
        if(this.get('coupon.amountType')){
          return this.get('applyCoupon').amountDiscount(this.get('coupon.amountOff'), this.get('proratedAddonBill'));
        }
        if(this.get('coupon.percentType')){
          return this.get('applyCoupon').percentDiscount(this.get('coupon.percentOff'), this.get('proratedAddonBill'));
        }
      }
      else{
        return this.get('proratedAddonBill');
      }
    }),
    couponedProratedTotalBill: Ember.computed('couponedProratedPlanBill', 'couponedProratedAddonBill', function(){
      return this.get('couponedProratedPlanBill')+this.get('couponedProratedAddonBill');
    }),
    couponedRegularPlanBill: Ember.computed('regularPlanBill', 'coupon', function(){
      if(this.get('coupon.id')){
        if(this.get('coupon.amountType')){
          return this.get('applyCoupon').amountDiscount(this.get('coupon.amountOff'), this.get('regularPlanBill'));
        }
        if(this.get('coupon.percentType')){
          return this.get('applyCoupon').percentDiscount(this.get('coupon.percentOff'), this.get('regularPlanBill'));
        }
      }
      else{
        return this.get('regularPlanBill');
      }
    }),
    couponedRegularAddonBill: Ember.computed('regularAddonBill', 'coupon', function(){
      if(this.get('coupon.id') && this.get('coupon.billType')){
        if(this.get('coupon.amountType')){
          return this.get('applyCoupon').amountDiscount(this.get('coupon.amountOff'), this.get('regularAddonBill'));
        }
        if(this.get('coupon.percentType')){
          return this.get('applyCoupon').percentDiscount(this.get('coupon.percentOff'), this.get('regularAddonBill'));
        }
      }
      else{
        return this.get('regularAddonBill');
      }
    }),
    couponedRegularTotalBill: Ember.computed('couponedRegularPlanBill', 'couponedRegularAddonBill', function(){
      return this.get('couponedRegularPlanBill')+this.get('couponedRegularAddonBill');
    }),
    //This tell what is couponed bill for the plan next month
    couponedNextMonthPlanBill: Ember.computed('nextMonthPlanBill', function(){
      if(this.get('nextMonthPlanBill') && this.get('coupon.id') && this.get('coupon.nextMonthAvailable')){
        if(this.get('coupon.amountType')){
          return this.get('applyCoupon').amountDiscount(this.get('coupon.amountOff'), this.get('nextMonthPlanBill'));
        }
        if(this.get('coupon.percentType')){
          return this.get('applyCoupon').percentDiscount(this.get('coupon.percentOff'), this.get('nextMonthPlanBill'));
        }
      }
      else{
        return this.get('nextMonthPlanBill');
      }

    }),
    //This tell what is couponed bill for the addon next month
    couponedNextMonthAddonBill: Ember.computed('hasNextMonthAddonItems', function(){
      if(this.get('hasNextMonthAddonItems') && this.get('coupon.id') && this.get('coupon.nextMonthAvailable') && this.get('coupon.billType')){
        if(this.get('coupon.amountType')){
          return this.get('applyCoupon').amountDiscount(this.get('coupon.amountOff'), this.get('totalAddonItemsPrice'));
        }
        if(this.get('coupon.percentType')){
          return this.get('applyCoupon').percentDiscount(this.get('coupon.percentOff'), this.get('totalAddonItemsPrice'));
        }
      }
      else{
        return this.get('totalAddonItemsPrice');
      }
    }),
    //This tell what is couponed bill for the total bill next month
    couponedNextMonthTotalBill: Ember.computed('couponedNextMonthPlanBill', 'couponedNextMonthAddonBill', function(){
      return this.get('couponedNextMonthPlanBill') + this.get('couponedNextMonthAddonBill');
    }),

    //This tells us whether coupon is applicable on next billing date
    nextBillingDateCouponApplicable: Ember.computed(function(){
      return this.get('applyCoupon').couponApplicable(this, this.get('nextBillingDate'));
    }),
    //This tell what is couponed bill for the total bill on next billing date
    couponedNextBillingDateTotalBill: Ember.computed(function(){
      if(this.get('nextMonthBilled')){
        return this.get('couponedNextMonthTotalBill');
      }
      if(this.get('nextBillingDateCouponApplicable')){
        if(this.get('coupon.amountType')){
          return this.get('applyCoupon').amountDiscount(this.get('coupon.amountOff'), this.get('nextBillingDateTotalBill'));
        }
        if(this.get('coupon.percentType')){
          return this.get('applyCoupon').percentDiscount(this.get('coupon.percentOff'), this.get('nextBillingDateTotalBill'));
        }
      }
      return this.get('nextBillingDateTotalBill');
    }),
    couponedNextBillingDateTotalBill: Ember.computed(function(){
      return this.get('couponedNextBillingDatePlanBill') + this.get('couponedNextBillingDateAddonBill');
    }),
    couponedNextBillingDatePlanBill: Ember.computed(function(){
      if(this.get('nextMonthBilled')){
        return this.get('couponedNextMonthPlanBill');
      }
      if(this.get('nextBillingDateCouponApplicable')){
        if(this.get('coupon.amountType')){
          return this.get('applyCoupon').amountDiscount(this.get('coupon.amountOff'), this.get('nextBillingDatePlanBill'));
        }
        if(this.get('coupon.percentType')){
          return this.get('applyCoupon').percentDiscount(this.get('coupon.percentOff'), this.get('nextBillingDatePlanBill'));
        }
      }
      return this.get('nextBillingDatePlanBill');
    }),
    couponedNextBillingDateAddonBill: Ember.computed(function(){
      if(this.get('nextMonthBilled')){
        return this.get('couponedNextMonthAddonBill');
      }
      return this.get('nextBillingDateAddonBill');
    })
});
