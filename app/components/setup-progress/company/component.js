import Ember from 'ember';
const {
    Component,
    inject,
    computed
} = Ember;
export default Component.extend({
    session: inject.service('session'),
    store: inject.service('store'),
    count: 4,
    company: computed('session.company.id', function() {
        return this.get('store').findRecord("company", this.get('session.company.id'));
    }),
    details: computed('company.about', 'company.address', 'company.city', 'company.logo', 'company.name', 'company.phone', 'company.country', 'company.state', function() {
        return !!this.get('company.about') && !!this.get('company.address') && !!this.get('company.city') && !!this.get('company.logo') && !!this.get('company.name') && !!this.get('company.phone') && !!this.get('company.country.id') && !!this.get('company.state.id');
    }),
    plan: computed('company.subscription', function() {
        return !!this.get('company.subscription.id');
    }),
    brands: computed('company.brands.length', function() {
        return !!this.get('company.brands.length');
    }),
    team: computed('company.companyMembers.length', function() {
        return !!this.get('company.companyMembers.length');
    }),
    doneCount: computed('details', 'plan', 'brands', 'team', function() {
        return this.get('details') + this.get('plan') + this.get('brands') + this.get('team');
    }),
    donePerc: Ember.computed('count', 'doneCount', {get() {
            if (!!this.get("count")) {
                return Math.round((this.get("doneCount") / this.get("count")) * 100);
            }
            return 0;
        }
    }),
    actions: {
        link() {
            this.get("router").transitionTo("company.edit.setup", this.get("session.company.id"));
        }
    }


});
