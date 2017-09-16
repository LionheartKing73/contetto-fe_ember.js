import DS from 'ember-data';
import Ember from 'ember';
import ProrationMixin from '../mixins/company/proration';
import CountsMixin from '../mixins/company/counts';

const {
  attr,
  belongsTo,
  hasMany,
} = DS;

const {
  computed
} = Ember;

export default DS.Model.extend(ProrationMixin, CountsMixin, {
  about: attr('string'),
  address: attr('string'),
  city: attr('string'),
  name: attr('string'),
  owner: attr('string'),
  phone: attr('string'),
  postal: attr('string'),
  logo: attr('string'),
  country: belongsTo('location'),
  state: belongsTo('location'),

  invites: hasMany('invite'),
  companyRoles: hasMany('companyRole'),
  companyMembers: hasMany('companyMember', { async: true }),
  brands: hasMany('brand', {aync: true}),

  subscription: belongsTo('subscription'),
  invoices: hasMany('invoice', {
    inverse: 'company'
  }),
  unpaidInvoice: belongsTo('invoice', {
    inverse: null
  }),
  payments: hasMany('payment'),
  accountBalance: attr('number'),

  brandsUsage: attr('number'),
  fileStorageUsage: attr('number'),
  postingsUsage: attr('number'),
  socialAccountsUsage: attr('number'),
  teamMembersUsage: attr('number'),


  locked: attr('to-boolean'),
  cancelledSubscription: attr('to-boolean'),
  isTrial: attr('to-boolean'),
  isBilling: computed.not('isTrial'),
  isProration: computed('subscription.trialEndDate', function(){
    return !this.get('isTrial') && moment()<=moment(this.get('subscription.trialEndDate')).endOf('day');
  }),
  isRegular: computed('isTrial', 'isProration', function(){
    return !this.get('isTrial') && !this.get('isProration');
  })
});
