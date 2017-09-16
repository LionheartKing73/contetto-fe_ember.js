import Ember from 'ember';
import TypeAddonItems from './type-addon-items';
const {
  get,
  inject: {
    service
  }
} = Ember;

//subscription
//addons => array of type-addon-items
export default Ember.Object.extend({
  init() {
    this.setAddons();
    this._super(...arguments);
  },
  setAddons() {
    let addonTypes = this.get('addonTypes');
    let addonArr = [];
    let groupedAddonItems = this.get('groupedAddonItems') || this.get('subscription.allCurrentGroupedAddonItems');
    Object.values(groupedAddonItems).forEach((addonItem) => {
      let obj = {
        id: addonItem.id,
        name: addonItem.name,
        unitPrice: addonItem.unitPrice,
        unitPerks: addonItem.unitPerks,
        count: addonItem.count
      };
      if (this.get('editable')) {
        obj.newCount = addonItem.count;
      }
      addonArr.push(TypeAddonItems.create(obj));
    });
    let embAddonArr = Ember.ArrayProxy.create({ content: Ember.A(addonArr) });
    this.set('addons', embAddonArr);
  },
  countChanged: Ember.computed('addons.@each.newCount', function() {
    if (!this.get('editable')) {
      return false;
    }
    let changed = false;
    this.get('addons').forEach((addon) => {
      if (addon.get('newCount') != addon.get('count')) {
        changed = true;
        return;
      }
    });
    return changed;
  }),
  reset() {
    this.get('addons').forEach((addon) => {
      addon.set('newCount', addon.get('count'));
    });
  }
});
