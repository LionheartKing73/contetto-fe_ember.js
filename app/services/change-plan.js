import Ember from 'ember';
//This service aims to handle all the queries related to changing the plan. It checks the feasibility for the plan change. It checks the type of conversion for the plan change. It upgrades plan, downgrades plan, change plan period, removes changed plan.
export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  toast: Ember.inject.service(),
  process(subscription, newPlan){
    return new Promise(function(resolve, reject){
      if(!this.newPlanLimitSatisfiy(subscription,newPlan)){
        reject("Usage limit in this subscription doesnot allow to change plan.");
      }
      else{
        if((subscription.get('plan.monthly') && newPlan.get('monthly')) || (subscription.get('plan.yearly') && newPlan.get('yearly'))){
          this.samePeriodChange(subscription, newPlan, resolve, reject);
        }
        if((subscription.get('plan.monthly') && newPlan.get('yearly')) || (subscription.get('plan.yearly') && newPlan.get('monthly'))){
          this.differentPeriodChange(subscription, newPlan, resolve);
        }
      }
    });
  },
  canChangePlan(subscription, newPlan){
    return this.newPlanLimitSatisfiy(subscription, newPlan);
  },
  newPlanLimitSatisfiy(subscription, newPlan){
    let company = subscription.get('company');
    let allowedBrand = company.get('brandsUsage')-subscription.get('totalAddonBrands');
    let allowedSocialAccounts = company.get('socialAccountsUsage')-subscription.get('totalAddonSocialAccounts');
    let allowedPosts = company.get('postingsUsage')-subscription.get('totalAddonPosts');
    let allowedStorage = company.get('fileStorageUsage')-subscription.get('totalAddonStorage');
    let allowedTeamMembers = company.get('teamMembersUsage')-subscription.get('totalAddonBrandMembers');
    let brandsCheck = newPlan.get('brandsCount')>=allowedBrand;
    let socialAccountsCheck = newPlan.get('socialAccountsCount')>=allowedSocialAccounts;
    let postsCheck = newPlan.get('postsCount')>=allowedPosts;
    let storageCheck = newPlan.get('storageSize')>=allowedStorage;
    let teamMembersCheck = newPlan.get('teamMembersCount')>=allowedTeamMembers;
    return brandsCheck && socialAccountsCheck && postsCheck && storageCheck && teamMembersCheck;
  },
  samePeriodChange(subscription, newPlan, resolve){
    if(this.isUpgrading(subscription, newPlan)){
      this.upgradePlan(subscription, newPlan, resolve, reject);
    }
    else{
      this.downgradePlan(subscription, newPlan, resolve);
    }
  },
  differentPeriodChange(subscription, newPlan, resolve){
    subscription.set('newPlan', newPlan);
    subscription.save().then((s) => {
      resolve(s);
    });
  },
  alreadyChangePlan(subscription){
    return subscription.get('downgradePlan') || subscription.get('newPlan');
  },
  isUpgrading(subscription, newPlan){
    return !this.isChangingPeriod(subscription, newPlan) && newPlan.get('price')>subscription.get('plan.price');
  },
  isDowngrading(subscription, newPlan){
    return !this.isChangingPeriod(subscription, newPlan) && newPlan.get('price')<subscription.get('plan.price');
  },
  isChangingPeriod(subscription, newPlan){
    return (newPlan.get('monthly') && subscription.get('plan.yearly')) || (newPlan.get('yearly') && subscription.get('plan.monthly'))
  },
  upgradePlan(subscription, newPlan){
    this.get('billing').payPlan(subscription, newPlan, resolve, reject);
  },
  downgradePlan(subscription, newPlan, resolve){
    subscription.set('downgradePlan', newPlan);
    subscription.save().then((s) => {
      resolve(s);
    })
  },
  removeChangedPlan(subscription){
    subscription.set('downgradePlan', null);
    subscription.set('newPlan', null);
    subscription.save().then((s) => {
      this.get('toast').success('Plan removed successfully!', 'Success');
    });
  }
});
