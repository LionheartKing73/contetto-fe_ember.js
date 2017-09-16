import Ember from 'ember';
import DS from 'ember-data';
import {
  taskGroup
}
from 'ember-concurrency';

const {
  Component,
  get,
  set,
  inject: {
    service
  }
} = Ember;

export default Ember.Component.extend({
  session: service(),
  store: service(),
  chartAjaxTask: taskGroup().enqueue().maxConcurrency(2),

  socialAccounts: null,

  brand: Ember.computed.alias('session.brand'),
  user: Ember.computed('session.data.authenticated.userId', function() {
    const userId = get(this, 'session.data.authenticated.userId');

    if (userId != undefined && userId != null) {
      return get(this, 'store').peekRecord('user', userId);
    }
    return null;
  }),

  brandDepratments: Ember.computed('brand', function() {
    const brandId = get(this, 'brand.id');
    const userId = get(this, 'user.id');

    if (!brandId) {
      return [];
    }

    const promise = get(this, 'store').query('department', {
      brand: brandId
    }).then((brandDepts) => {
      let managingBrand = brandDepts.filter((dept) => {
        return dept.get('manager.user.id') === userId;
      });

      return managingBrand;
    });

    return DS.PromiseArray.create({
      promise: promise
    });
  }),

  brandRole: Ember.computed('user', 'brand', function() {
    if (!get(this, 'brand')) {
      return;
    }
    var self = this;
    const promise = get(this, 'brand.brandMembers').then((members) => {
      //  const member = members.filterBy('user.id', get(self, 'session.data.authenticated.userId')).get('firstObject');

      //return member.get('brandRole');
    });

    return DS.PromiseObject.create({
      promise: promise
    });
  }),

  canViewInbox: Ember.computed('brandRole.isFulfilled', function() {
    if (get(this, 'brandRole.isFulfilled')) {
      return get(this, 'brandRole.viewInbox');
    }

    return false;
  }),

  isBrandManager: Ember.computed('brandRole.isFulfilled', function() {
    if (get(this, 'brandRole.isFulfilled')) {
      return get(this, 'brandRole.viewAnalytics');
    }

    return false;
  }),

  hasBrandMembers: Ember.computed.gt('brand.brandMembers.length', 1),
  canShowTeamCharts: Ember.computed.and('isBrandManager', 'hasBrandMembers'),

  didReceiveAttrs() {
    const brandId = get(this, 'session.brand.id');


    get(this, 'store').query('social-account', {
      brand: brandId
    }).then((accounts) => {
      if (get(this, 'isDestroyed') || get(this, 'isDestroying')) {
        return true;
      }

      set(this, 'socialAccounts', accounts);
    })
  }
});
