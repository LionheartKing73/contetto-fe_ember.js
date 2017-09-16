import Ember from 'ember';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  validate(code, component) {
    let url = "https://gke.contetto.io/billing/v1/couponsValidation?code=" + code;
    this.get('ajax').post(url).then((response) => {
      component.send('validCoupon');
    }).catch((response) => {
      component.send('invalidCoupon');
      //response.errors[0].title
    });
  },
  couponApplicable(subscription, date) {
    if(!subscription.get('coupon')){
      return false;
    }
    if (!date) {
      date = moment();
    }
    let dateValid = subscription.get('coupon.lastCouponDate') >= date;
    let monthlyPlan = subscription.get('plan.monthly');
    let planCoupon = subscription.get('coupon.planType');
    let yearlyCoupon = subscription.get('coupon.yearlyCoupon');
    let monthlyCoupon = subscription.get('coupon.monthlyCoupon');
    let lifelongCoupon = subscription.get('coupon.lifelongCoupon');
    /*
      Plan => monthly, Coupon=> on plan, is monthly/lifelong
      Plan => monthly, Coupon=> on bill, is monthly/lifelong
      Plan => yearly, Coupon=> on plan, is yearly/lifelong
    */
    if(planCoupon && subscription.get('plan.id')!=subscription.get('coupon.plan.id')){
      return false;
    }
    if(monthlyPlan){
      if((monthlyCoupon || lifelongCoupon) && dateValid){
        return true;
      }
    }
    else{
      return (yearlyCoupon || lifelongCoupon) && planCoupon && dateValid;
    }
    return false;
  },
  couponApplyMessage(subscription, date){
    if(this.couponApplicable(subscription, date)){
      return subscription.get('coupon.perks');
    }
    if(!subscription.get('coupon')){
      return "Coupon not entered";
    }
    if (!date) {
      date = moment();
    }
    let dateValid = subscription.get('coupon.lastCouponDate') >= date;
    let monthlyPlan = subscription.get('plan.monthly');
    let yearlyPlan = subscription.get('plan.yearly');
    let planCoupon = subscription.get('coupon.planType');
    let billCoupon = subscription.get('coupon.billType');
    let yearlyCoupon = subscription.get('coupon.yearlyCoupon');
    let monthlyCoupon = subscription.get('coupon.monthlyCoupon');
    let lifelongCoupon = subscription.get('coupon.lifelongCoupon');

    if(!dateValid){
      return "Coupon Expired";
    }
    if(billCoupon && yearlyPlan && monthlyCoupon){
      return "You selected a yearly plan. Please choose a monthly plan to avail this coupon.";
    }
    if(planCoupon && subscription.get('plan.id')!=subscription.get('coupon.plan.id')){
      return "The coupon you entered is not valid for the plan that you selected. Please select "+subscription.get('coupon.plan.name') + " plan";
    }
    return "This coupon is not applicable."
  },
  process(coupon, subscription, current) {
    let proration = false;
    let checkDate;
    if (subscription.get('company.isTrial') && current) {
      proration = true;
      checkDate = moment(subscription.get('billingStartDate'));
    } else if (subscription.get('company.isTrial')) {
      checkDate = moment(subscription.get('billingStartDate')).add(1, 'month').startOf('month');
    } else if (current) {
      checkDate = moment().startOf('month');
    } else {
      checkDate = moment().add(1, 'month').startOf('month');
    }
    if (coupon.get('id') && this.couponApplicable(subscription, checkDate)) {
      if (coupon.get('planType')) {
        return this.planCoupon(coupon.get('plan'), subscription, proration);
      }
      if (coupon.get('amountType')) {
        return this.amountCoupon(coupon.get('amountOff'), subscription, proration);
      }
      if (coupon.get('percentType')) {
        return this.percentCoupon(coupon.get('percentOff'), subscription, proration);
      }
    }
    if (proration) {
      return subscription.get('firstBillingMonthCost');
    }
    return subscription.get('regularMonthlyCost');
  },
  prorationVal(subscription, proration) {
    if (proration) {
      return subscription.get('prorationDays') / subscription.get('firstBillingMonthDays');
    }
    return 1;
  },
  planCoupon(plan, subscription, proration) {
    return subscription.get('regularMonthlyAddonCost') * this.prorationVal(subscription, proration);
  },
  amountCoupon(amountOff, subscription, proration) {
    let val = (subscription.get('regularMonthlyCost') - amountOff) * this.prorationVal(subscription, proration)
    return val < 0 ? 0 : val;
  },
  percentCoupon(percentOff, subscription, proration) {
    return subscription.get('regularMonthlyCost') * (100 - percentOff) * this.prorationVal(subscription, proration) / 100;
  },
  percentDiscount(percentOff, value) {
    return value * (100 - percentOff) / 100;
  },
  amountDiscount(amountOff, value) {
    return value - amountOff;
  },
  totalDiscount(percentOff, value){
    return value * percentOff / 100;
  }
});
