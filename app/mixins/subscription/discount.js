import Ember from 'ember';

export default Ember.Mixin.create({
    applyCoupon: Ember.inject.service(),
    //This tells what discount is given by coupon is amount or percentage.
    discount: Ember.computed('coupon', function(){
        console.log(this.get('coupon'));
        console.log(this.get('coupon').percentOff);
      if(this.get('coupon.id')){
        if(this.get('coupon.amountOff')){
          return "$"+this.get('coupon.amountOff');
        }

        return ((this.get('coupon.percentOff') !== undefined) ? this.get('coupon.percentOff') : 0)+"%";
      }
      else{
        return "$0";
      }
    }),
    //This tells what discount is given on plan if the company is in proration period.
    discountOnProratedPlanBill: Ember.computed('proratedPlanBill', 'coupon', function(){
      if(this.get('coupon.id')){
        if(this.get('coupon.amountType')){
          return this.get('coupon.amountOff');
        }
        if(this.get('coupon.percentType')){
          return this.get('applyCoupon').totalDiscount(this.get('coupon.percentOff'), this.get('proratedPlanBill'));
        }
      }
      else{
        return 0;
      }
    }),
    //This tells what discount is given on addon if the company is in proration period
    discountOnProratedAddonBill: Ember.computed('proratedAddonBill', 'coupon', function(){
      if(this.get('coupon.id') && this.get('coupon.billType')){
        if(this.get('coupon.amountType')){
          return this.get('coupon.amountOff');
        }
        if(this.get('coupon.percentType')){
          return this.get('applyCoupon').totalDiscount(this.get('coupon.percentOff'), this.get('proratedAddonBill'));
        }
      }
      else{
        return 0;
      }
    }),
    //This tells what discount is given on total bill if the company is in proration period.
    discountOnProratedTotalBill: Ember.computed('discountOnProratedPlanBill', 'discountOnProratedAddonBill', function(){
      return this.get('discountOnProratedPlanBill')+this.get('discountOnProratedAddonBill');
    }),
    //This tells what discount is given on plan if the company is in regular period.
    discountOnRegularPlanBill: Ember.computed('regularPlanBill', 'coupon', function(){
      if(this.get('coupon.id')){
        if(this.get('coupon.amountType')){
          return this.get('coupon.amountOff');
        }
        if(this.get('coupon.percentType')){
          return this.get('applyCoupon').totalDiscount(this.get('coupon.percentOff'), this.get('regularPlanBill'));
        }
      }
      else{
        return 0;
      }
    }),
    //This tells what discount is given on addons if the company is in regular period.
    discountOnRegularAddonBill: Ember.computed('regularAddonBill', 'coupon', function(){
      if(this.get('coupon.id') && this.get('coupon.billType')){
        if(this.get('coupon.amountType')){
          return this.get('coupon.amountOff');
        }
        if(this.get('coupon.percentType')){
          return this.get('applyCoupon').totalDiscount(this.get('coupon.percentOff'), this.get('regularAddonBill'));
        }
      }
      else{
        return 0;
      }
    }),
    //This tells what discount is given on total bill if the company is in regular period.
    discountOnRegularTotalBill: Ember.computed('discountOnRegularPlanBill', 'discountOnRegularAddonBill', function(){
      return this.get('discountOnRegularPlanBill')+this.get('discountOnRegularAddonBill');
    }),
    //This tell what discount is given on the plan next month
    discountOnNextMonthPlanBill: Ember.computed('nextMonthPlanBill', function(){
      if(this.get('nextMonthPlanBill') && this.get('coupon.id') && this.get('coupon.nextMonthAvailable')){
        if(this.get('coupon.amountType')){
          return this.get('coupon.amountOff');
        }
        if(this.get('coupon.percentType')){
          return this.get('applyCoupon').totalDiscount(this.get('coupon.percentOff'), this.get('nextMonthPlanBill'));
        }
      }
      return 0;
    }),
    //This tell what discount is given on the addon next month
    discountOnNextMonthAddonBill: Ember.computed('hasNextMonthAddonItems', function(){
      if(this.get('hasNextMonthAddonItems') && this.get('coupon.id') && this.get('coupon.nextMonthAvailable') && this.get('coupon.billType')){
        if(this.get('coupon.amountType')){
          return this.get('coupon.amountOff');
        }
        if(this.get('coupon.percentType')){
          return this.get('applyCoupon').totalDiscount(this.get('coupon.percentOff'), this.get('totalAddonItemsPrice'));
        }
      }
      return 0;
    }),
    //This tell what discount is given on the total bill next month
    discountOnNextMonthTotalBill: Ember.computed('discountOnNextMonthPlanBill', 'discountOnNextMonthAddonBill', function(){
      return this.get('discountOnNextMonthPlanBill') + this.get('discountOnNextMonthAddonBill');
    }),
    //This tell what discount is given on the total bill on next billing date
    discountOnNextBillingDateTotalBill: Ember.computed(function(){
      return this.get('discountOnNextBillingDatePlanBill') + this.get('discountOnNextBillingDateAddonBill');
    }),
    discountOnNextBillingDatePlanBill: Ember.computed(function(){
      if(this.get('nextMonthBilled')){
        return this.get('discountOnNextMonthPlanBill');
      }
      if(this.get('nextBillingDateCouponApplicable')){
        if(this.get('coupon.amountType')){
          return this.get('coupon.amountOff');
        }
        if(this.get('coupon.percentType')){
          return this.get('applyCoupon').totalDiscount(this.get('coupon.percentOff'), this.get('nextBillingDatePlanBill'));
        }
      }
      else{
        return 0;
      }
    }),
    discountOnNextBillingDateAddonBill: Ember.computed(function(){
      if(this.get('nextMonthBilled')){
        return this.get('discountOnNextMonthAddonBill');
      }
      return 0;
    })

});
