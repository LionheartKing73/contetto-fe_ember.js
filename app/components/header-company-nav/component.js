import Ember from 'ember';

const {
  Component,
  get,
  set,
  isEmpty,
  inject: { service },
  computed,
  isArray
} = Ember;

export default Component.extend({
  store: service('store'),
  session: service(),

  brands: computed('companies.[]', 'session.compnay.id', function () {

    if (get(this, 'companies.isLoaded') && !isEmpty(get(this, 'session.compnay.id'))) {
      const currentCompanyId = get(this, 'session.compnay.id');
      const company = get(this, 'store').peekRecord('company', currentCompanyId);

      if (isEmpty(company) || get(company, 'brands.length') === 0) {
        set(this, 'session.brand.idId', null);
      } else {
        set(this, 'session.brand.idId', get(company, 'brands.firstObject.id'));
      }

      return !isEmpty(company) ? get(company, 'brands') : [];
    }
    return [];
  }),

  init() {
    this._super(...arguments);

    const _this = this;
    const firstCompany = get(this, 'store').peekAll('company');

    if (!isEmpty(get(this, 'companies')) && isArray(get(this, 'companies'))) {
      const defaultCompanyId = get(this, 'companies.firstObject.id');
      this.send('changeCompany', defaultCompanyId);
    }

    if (!isEmpty(get(this, 'brands')) && isArray(get(this, 'brands'))) {
      const defaultBrandId = get(this, 'brands.firstObject.id');
      this.send('changeBrand', defaultBrandId);
    }

    if (isEmpty(get(this, 'companies')) && !isEmpty(get(this, 'brandList'))) {
      get(this, 'brandList').forEach(d => {
        d.belongsTo('company').load().then(() => {
          _this.send('changeCompany', get(firstCompany, 'firstObject.id'));
        });
      });
    }
  },

  actions: {
    changeCompany(companyId) {
      get(this, 'companyDetail').changeCompany(companyId);
    },

    changeBrand(brandId) {
      get(this, 'companyDetail').changeBrand(brandId);
    }
  }
});
