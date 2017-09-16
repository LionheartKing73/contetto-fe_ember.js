import Ember from 'ember';
import {
  task,
  timeout
}
from 'ember-concurrency';

const {
  Component,
  get,
  getProperties,
  set,
  computed,
  inject
} = Ember;

export default Component.extend({
  classNames: ['col-md-3', 'col-sm-3', 'col-lg-2', 'right-side-wrapper'],
  classNameBindings: ["isClosed:closed"],

  session: inject.service(),
  store: inject.service(),
  // Periodically refresh widget info
  // _reloadDataTask: task(function*() {
  //   this.setBrands();
  //   while (true) {
  //     yield get(this, 'notifications');

  //     yield timeout(60 * 1000); // Wait 60 seconds
  //   }
  // }).on('init'),

  brands: Ember.computed(function() {
    return get(this, 'store').filter('brand', {}, function() { return true; })
  }),

  showLoading: true,

  _notificationsPromise: null,
  _notifications: computed({
    get() {
      return [];
    }
  }),
  _cachedBrand: null,
  cachedBrand: computed('_cachedBrand', {
    get() {
      return get(this, '_cachedBrand');
    }
  }),
  notifications: computed('brand', function() {
    const {
      brand,
      cachedBrand
    } = getProperties(this, 'brand', 'cachedBrand');
    if (!!brand && brand !== cachedBrand) {
      set(this, 'showLoading', true);
      set(this, '_cachedBrand', brand);
    }
    let query = {
      page: 0,
      size: 25,
      handled: -1
    };
    const brandId = get(this, 'brand.id');
    const _this = this;
    if (brandId) {
      query.brand = brandId;
    }
    var noties = get(this, 'store').filter('notification', query, function(notification) {
      return notification.get('user.id') == _this.get("session.data.authenticated.userId") && (!brandId || (brandId && notification.get('brand.id') == brandId)) && !notification.get('handled');
    });
    noties.then(() => {
      _this.set('showLoading', false);
    });
    return noties;
  })
});
