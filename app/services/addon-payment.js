import Ember from 'ember';
//this service is meant to pay the plan. It calculates outstanding amount to be paid if a plan is changed.
// The plan can be upgraded, downgraded or periodChanged. In case of upgrade only, the payment is paid.
export default Ember.Service.extend({
  store: Ember.inject.service(),
  ajax: Ember.inject.service(),
  applyCoupon: Ember.inject.service(),
  changePlan: Ember.inject.service(),
  payAddon(subscription, upgradedAddons) {
    //TODO: payAddon API to be implemented yet
    // let url = `https://gke.contetto.io/billing/v1/upgradePlan?subscription=${subscription.get('id')}&plan=${plan.get('id')}`;
    // return this.get('ajax').request(url);
  },
  payAddonRecords(subscription, upgradedAddons) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let company = subscription.get('company');
      var invoice = self.get('store').createRecord('invoice', {
        date: moment(),
        company: company
      });
      invoice.save().then((invoiceRecord) => {
        let lineItemsPromiseArr = [];
        for (let addonType in upgradedAddons) {
          let upAdd = upgradedAddons[addonType];
          if(upAdd['addonId'] !== undefined) {
              var lineItem = self.get('store').createRecord('lineItem', {
                  invoice: invoiceRecord,
                  itemType: 'addon',
                  itemId: upAdd['addonId'],
                  quantity: upAdd['diff'],
                  factor: self.prorationFactor()
              });
              lineItemsPromiseArr.push(lineItem.save());
          }
        }
        Promise.all(lineItemsPromiseArr).then((lineItems) => {
          var payment = self.get('store').createRecord('payment', {
            amount: self.couponedAddonPrice(subscription, upgradedAddons),
            date: moment(),
            card: subscription.get('card'),
            invoice: invoiceRecord,
            company: company
          });
          payment.save().then((paymentRecord) => {
            resolve()
          }).catch((paymentRecord) => {
            reject()
          });
        }).catch((lineItemsError) => {
          reject();
        });
      }).catch((invoiceRecord) => {
        reject();
      });
    });
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
  prorationFactor() {
    return this.prorationDays() / this.monthDays();
  },
  outstandingAddonPrice(subscription, upgradedAddons){
    let totalAddonPrice = 0;
    upgradedAddons.forEach((addon) => {
      totalAddonPrice += addon['priceDiff'];
    });
    return totalAddonPrice;
  },
  addonPrice(subscription, upgradedAddons) {
    let totalAddonPrice = this.outstandingAddonPrice(subscription, upgradedAddons);
    if (subscription.get('company.isTrial')) {
      return (totalAddonPrice * subscription.get('addonProrationFactor')).toFixed(2);
    }
    return (totalAddonPrice * this.prorationFactor()).toFixed(2);
  },
  couponedAddonPrice(subscription, upgradedAddons) {
    let addonPrice = this.addonPrice(subscription, upgradedAddons);
    if (subscription.get('coupon.id') && subscription.get('coupon.billType') && subscription.get('coupon.currentMonthApplied')) {
      if (subscription.get('coupon.amountType')) {
        return this.get('applyCoupon').amountDiscount(subscription.get('coupon.amountOff'), addonPrice);
      }
      if (this.get('coupon.percentType')) {
        return this.get('applyCoupon').percentDiscount(subscription.get('coupon.percentOff'), addonPrice);
      }
    } else {
      return addonPrice;
    }
  },
  discountOnAddonPrice(subscription, upgradedAddons) {
    let addonPrice = this.addonPrice(subscription, upgradedAddons);
    if (subscription.get('coupon.id') && subscription.get('coupon.billType') && subscription.get('coupon.currentMonthApplied')) {
      if (subscription.get('coupon.amountType')) {
        return subscription.get('coupon.amountOff');
      }
      if (this.get('coupon.percentType')) {
        return this.get('applyCoupon').totalDiscount(subscription.get('coupon.percentOff'), addonPrice);
      }
    } else {
      return 0;
    }
  }
});
