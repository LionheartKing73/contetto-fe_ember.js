import Ember from 'ember';
//this service is meant to pay the plan. It calculates outstanding amount to be paid if a plan is changed.
// The plan can be upgraded, downgraded or periodChanged. In case of upgrade only, the payment is paid.
export default Ember.Service.extend({
  store: Ember.inject.service(),
  ajax: Ember.inject.service(),
  applyCoupon: Ember.inject.service(),
  changePlan: Ember.inject.service(),
  payPlan(subscription, plan) {
    let url = `https://gke.contetto.io/billing/v1/upgradePlan?subscription=${subscription.get('id')}&plan=${plan.get('id')}`;
    return this.get('ajax').request(url);
  },
  payPlanRecords(subscription, newPlan) {
    new Promise(function(resolve, reject) {
      var invoice = this.get('store').createRecord('invoice', {
        date: new Date(),
        company: subscription.get('company')
      });
      invoice.save().then((invoiceRecord) => {
        var lineItem = this.get('store').createRecord('lineItem', {
          invoice: invoiceRecord,
          itemType: 'plan',
          itemId: newPlan.get('id'),
          quantity: 1,
          factor: this.planProrationFactor()
        });
        lineItem.save().then((lineItemRecord) => {
          let planPrice = (newPlan.get('price') - subscription.get('plan.price')) * this.planProrationFactor();
          var payment = this.get('store').createRecord('payment', {
            amount: planPrice,
            date: new Date(),
            card: subscription.get('card'),
            invoice: invoiceRecord,
            company: subscription.get('company')
          });
          payment.save().then((paymentRecord) => {
            resolve();
          }).catch((paymentRecord) => {
            reject();
          })
        }).catch((lineItemRecord) => {
          reject();
        });
      }).catch((invoiceRecord) => {
        reject();
      });
    })
  },
  prorationDays() {
    let yesterday = moment().add(-1, 'days');
    let eom = moment(yesterday).endOf('month');
    let diff = eom.diff(yesterday, 'days');
    return diff;
  },
  monthDays() {
    return moment().daysInMonth();
  },
  yearDays() {
    if (moment().isLeapYear()) {
      return 366;
    } else {
      return 365;
    }
  },
  totalDays(plan) {
    if (plan.get('monthly')) {
      return this.monthDays();
    }
    if (plan.get('yearly')) {
      return this.yearDays();
    }
  },
  planProrationFactor(plan) {
    return this.prorationDays() / this.totalDays(plan);
  },
  outstandingPlanPrice(plan, subscription) {
    if (subscription.get('company.isTrial')) {
      return (plan.get('price') * subscription.get('planProrationFactor')).toFixed(2);
    }
    if (this.get('changePlan').isUpgrading(subscription, plan)) {
      return ((plan.get('price') - subscription.get('plan.price')) * this.planProrationFactor(plan)).toFixed(2);
    }
    if (this.get('changePlan').isDowngrading(subscription, plan)) {
      return (plan.get('price')).toFixed(2);
    }
    if (this.get('changePlan').isChangingPeriod(subscription, plan)) {
      return (plan.get('price')).toFixed(2);
    }
  },
  couponedOutstandingPlanPrice(plan, subscription) {
    let outstandingPlanPrice = this.outstandingPlanPrice(plan, subscription);
    if (subscription.get('coupon.id')) {
      if (subscription.get('coupon.amountType')) {
        return (this.get('applyCoupon').amountDiscount(subscription.get('coupon.amountOff'), outstandingPlanPrice)).toFixed(2);
      }
      if (this.get('coupon.percentType')) {
        return (this.get('applyCoupon').percentDiscount(subscription.get('coupon.percentOff'), outstandingPlanPrice)).toFixed(2);
      }
    } else {
      return outstandingPlanPrice;
    }
  },
  discountOnOutstandingPlanPrice(plan, subscription) {
    let outstandingPlanPrice = this.outstandingPlanPrice(plan, subscription);
    if (subscription.get('coupon.id') && subscription.get('coupon.currentMonthApplied')) {
      if (subscription.get('coupon.amountType')) {
        return subscription.get('coupon.amountOff');
      }
      if (this.get('coupon.percentType')) {
        return (this.get('applyCoupon').totalDiscount(subscription.get('coupon.percentOff'), outstandingPlanPrice)).toFixed(2);
      }
    } else {
      return 0;
    }
  }
});
