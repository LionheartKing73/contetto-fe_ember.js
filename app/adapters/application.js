import Ember from 'ember';
import DS from 'ember-data';
import config from './../config/environment';

import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const {
  get
} = Ember;

const ApplicationAdapter = DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:contetto',
  toast: Ember.inject.service(),
  session: Ember.inject.service(),
  host: config.REST.host,
  //	namespace: config.REST.namespace,
  headers: Ember.computed('session.X-Session', function() {
    return {
      "Content-Type": "application/vnd.api+json"
    };
  }),

  handleResponse(status, headers, payload) {
    if (status === 401 && get(this, 'session.isAuthenticated')) {
      get(this, 'session').invalidate();
    }
    else if (status === 400 || status === 0 || status === 403) {
      const errorMessage = payload.title || 'Server error!';
      this.get('toast').error(errorMessage, 'Error');
    }
    else if (payload === null && status === 200) {
      payload = {
        data: []
      };
    }
    return payload;
  },

  createRecord(store, type, snapshot) {
    if (type.modelName === "reset-password") {
      let data = {};
      let serializer = store.serializerFor(type.modelName);
      let url = this.buildURL(type.modelName, null, snapshot, 'createRecord');

      serializer.serializeIntoHash(data, type, snapshot, {
        includeId: true
      });

      return this.ajax(url, "PATCH", {
        data: data
      });
    }
    else {
      return this._super(...arguments);
    }
  },

  pathForType: function(type) {
    switch (type) {
      case 'followup-template':
        return 'postings/v1/templates';
      case 'followup-slot':
        return 'postings/v1/slots';
      case 'offset-type':
        return 'postings/v1/offsetTypes';
      case 'snippet':
        return 'postings/v1/snippets';
      case 'inbox-action':
        return 'inbox/v1/inboxAction';
      case 'inbox-room':
        return 'inbox/v1/rooms';
      case 'external-user':
        return 'inbox/v1/externalUsers';
      case 'inbox-item':
        return 'inbox/v1/inboxItem';
      case 'folder':
        return 'files/v1/folders';
      case 'device':
        return 'users/v1/devices';
      case 'campaign-goal':
        return 'campaigns/v1/campaignGoals';
      case 'subscription-price':
        return 'products/v1/subscriptionPrice';
      case 'landing-page':
        return 'products/v1/landingPages';
      case 'frequency':
        return 'products/v1/frequency';
      case 'posting-schedule-mode':
        return 'social-accounts/v1/postingScheduleModes';
      case 'channel-step':
        return 'review-channels/v1/steps';
      case 'last-seen':
        return 'chats/v1/lastSeen';
      case 'chat-room':
        return 'chats/v1/rooms';
      case 'chat-message':
        return 'chats/v1/messages';
      case 'user':
        return 'users/v1/users';
      case 'session':
        return 'users/v1/sessions';
      case 'file':
        return 'files/v1/files';
      case 'review-channel':
        return 'review-channels/v1/channels';
      case 'tag':
        return 'tags-srv/v1/tags';
      case 'account-schedule':
        return 'social-accounts/v1/accountSchedules';
      case 'network-type':
        return 'social-accounts/v1/networkTypes';
      case 'posting-schedule':
        return 'postings/v1/schedules';
      case 'posting-status':
        return 'postings/v1/postingStatuses';
      case 'change-request-status':
        return 'postings/v1/changeRequestStatuses';
      case 'change-request':
        return 'postings/v1/changeRequests';
      case 'company':
        return 'companies/v1/companies';
      case 'company-member':
        return 'companies/v1/companyMembers';
      case 'invite':
        return 'invites/v1/invites';
      case 'company-invite':
        return 'invites/v1/invites';
      case 'brand':
        return 'brands/v1/brands';
      case 'brand-member':
        return 'brands/v1/brandMembers';
      case 'campaign':
        return 'campaigns/v1/campaigns';
      case 'audiences-data':
        return 'audiences/v1/data';
      case 'location':
        return 'audiences/v1/locations';
      case 'audience':
        return 'audiences/v1/audiences';
      case 'post':
        return 'postings/v1/postings';
      case 'posting':
        return 'postings/v1/postings';
      case 'invite-confirm':
        return 'invites/v1/accepting';
      case 'forgot-password':
        return 'users/v1/reset';
      case 'social-account':
        return 'social-accounts/v1/accounts';
      case 'brand-role':
        return 'roles/v1/brands';
      case 'company-role':
        return 'roles/v1/companies';
      case 'category':
        return 'categories/v1/categories';
      case 'goal':
        return 'goals/v1/goals';
      case 'goal-type':
        return 'goals/v1/types';
      case 'goal-status':
        return 'goals/v1/statuses';
      case 'goal-metric':
        return 'goals/v1/metrics';
      case 'vertical':
        return 'verticals/v1/verticals';
      case 'plan':
        return 'billing/v1/plans';
      case 'subscription':
        return 'billing/v1/subscriptions';
      case 'card':
        return 'billing/v1/cards';
      case 'addon':
        return 'billing/v1/addons';
      case 'addon-item':
        return 'billing/v1/addonItems';
      case 'addon-type':
        return 'billing/v1/addonTypes';
      case 'invoice':
        return 'billing/v1/invoices';
      case 'invoice-status':
        return 'billing/v1/invoiceStatuses';
      case 'line-item':
        return 'billing/v1/lineItems';
      case 'payment':
        return 'billing/v1/payments';
      case 'payment-status':
        return 'billing/v1/paymentStatuses';
      case 'coupon':
        return 'billing/v1/coupons';
      case 'audiences-recommending':
        return 'audiences/v1/recommending';
      case 'page-metric':
        return 'social-accounts/v1/pageMetrics';
      case 'engagement-metric':
        return 'social-accounts/v1/engagementMetrics';
      case 'file':
        return 'files/v1/files';
      case 'notification':
        return 'notifications/v1/notifications';
      case 'department':
        return 'departments/v1/departments';
      case 'department-member':
        return 'departments/v1/departmentMembers';
      case 'duty':
        return 'departments/v1/duties';
      case 'product-group':
        return 'products/v1/groups';
      case 'product-type':
        return 'products/v1/types';
      case 'product-delivery':
        return 'products/v1/deliveries';
      case 'pricing-type':
        return 'products/v1/pricingTypes';
      case 'price-assessment':
        return 'products/v1/priceAssessments';
      case 'currency':
        return 'products/v1/currencies';
      case 'product':
        return 'products/v1/products';
    }

    return Ember.String.underscore(type);
  },

  updateRecord(store, type, snapshot) {

    if (type.modelName === "company-member" || type.modelName === "brand-member") {
      return this._super(store, type, snapshot);
    }
    else {
      const payload = {
        data: {
          id: snapshot.id,
          type: snapshot.modelName + 's',
          attributes: {}
        }
      };
      const changedAttributes = snapshot.changedAttributes();

      Object.keys(changedAttributes).forEach((attributeName) => {
        const newValue = changedAttributes[attributeName][1];
        // Do something with the new value and the payload
        // This will depend on what your server expects for a PATCH request
        payload.data.attributes[attributeName] = newValue;
      });

      let serializer = store.serializerFor(type.modelName);

      serializer.serializeIntoHash(payload, type, snapshot);

      const id = snapshot.id;
      const url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');

      return this.ajax(url, 'PATCH', {
        data: payload
      });
    }
  },

  query(store, type, query) {
    var proc = 'GET',
      url = this.buildURL(type.modelName),
      theFinalQuery = url + "?" + Ember.$.param(query);
    return this.ajax(theFinalQuery, proc);
  }

});

export default ApplicationAdapter;
