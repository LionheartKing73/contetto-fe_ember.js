import Ember from 'ember';

export default Ember.Mixin.create({
  storeService: Ember.inject.service('store'),
  groupedAddonItems: Ember.computed('addonItems.@each.id', function() {
    var hash = {};
    this.get('addonItems').forEach((addonItem) => {
      hash[addonItem.get('name')] = hash[addonItem.get('name')] || {id: addonItem.get('addon.id'), unitPrice: addonItem.get('addonPrice'), name: addonItem.get('name'), unitPerks: addonItem.get('addonAmount'), count: 0, price: 0, perks: 0};
      if (!addonItem.get('endDate')) {
        hash[addonItem.get('name')]['count'] +=1;
        hash[addonItem.get('name')]['price'] += addonItem.get('addonPrice');
        hash[addonItem.get('name')]['perks'] += addonItem.get('addonAmount');
      }
    });
    return hash;
  }),
  allCurrentGroupedAddonItems: Ember.computed('currentMonthAddonItems', function() {
    let addons = this.get('storeService').peekAll('addon');
    let currentMonthAddonItems = this.get('currentMonthAddonItems');
    let hash = {};
    addons.forEach((addon) => {
      hash[addon.get('name')] = currentMonthAddonItems[addon.get('name')] || {id: addon.get('id'), name: addon.get('name'), unitPrice: addon.get('price'), unitPerks: addon.get('amount'), count: 0, price: 0, perks: 0}
    });
    return hash;
  }),
  hasNextMonthAddonItems: Ember.computed('addonItems.@each.endDate', function() {
    var has = false;
    this.get('addonItems').forEach((addonItem) => {
      if (!addonItem.get('endDate')) {
        has = true;
      }
    });
    return has;
  }),
  totalAddonItemsPrice: Ember.computed('addonItems.@each.endDate', function(){
    let totalPrice = 0;
    this.get('addonItems').forEach((addonItem) => {
      if (!addonItem.get('endDate')) {
        totalPrice += addonItem.get('addonPrice');
      }
    });
    return totalPrice;
  }),
  currentMonthAddonItems: Ember.computed('addonItems.@each.id', function(){
    var hash = {};
    this.get('addonItems').forEach((addonItem) => {
      hash[addonItem.get('name')] = hash[addonItem.get('name')] || {id: addonItem.get('addon.id'), name: addonItem.get('name'), unitPrice: addonItem.get('addonPrice'), unitPerks: addonItem.get('addonAmount'), count: 0, price: 0, perks: 0};
      if (addonItem.get('valid')) {
        hash[addonItem.get('name')]['count'] +=1;
        hash[addonItem.get('name')]['price'] += addonItem.get('addonPrice');
        hash[addonItem.get('name')]['perks'] += addonItem.get('addonAmount');
      }
    });
    return hash;
  }),
  currentMonthAddonItemsPrice: Ember.computed('addonItems.@each.id', function(){
    let totalPrice = 0;
    this.get('addonItems').forEach((addonItem) => {
      if (addonItem.get('valid')) {
        totalPrice += addonItem.get('addonPrice');
      }
    });
    return totalPrice;
  }),
  alreadyDowngradedAddons: Ember.computed(function(){
    let monthLastDate = moment().endOf('month');
    let hash = {};
    this.get('addonItems').forEach((addonItem) => {
      if(addonItem.get('endDate') && addonItem.get('endDate').isSame(monthLastDate)){
        hash[addonItem.get('name')] = hash[addonItem.get('name')] || {id: addonItem.get('addon.id'), name: addonItem.get('name'), unitPerks: addonItem.get('addonAmount'), unitPrice: addonItem.get('addonPrice'), perks: 0, price: 0, count: 0};
        hash[addonItem.get('name')]['perks']+=addonItem.get('addonAmount');
        hash[addonItem.get('name')]['price']+=addonItem.get('addonPrice');
        hash[addonItem.get('name')]['count']+=1;
      }
    });
    return hash;
  }),
  alreadyDowngradedAddonItems: Ember.computed(function(){
    let monthLastDate = moment().endOf('month');
    let arr = [];
    subscription.get('addonItems').forEach((addonItem) => {
      if(addonItem.get('endDate').isSame(monthLastDate)){
        arr.push(addonItem);
      }
    });
    return arr;
  }),
  alreadyDowngradedAddonsPresent: Ember.computed('alreadyDowngradedAddons', function(){
    return Object.keys(this.get('alreadyDowngradedAddons')).length!=0;
  })

});
