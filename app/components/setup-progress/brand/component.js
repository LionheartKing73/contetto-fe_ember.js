import Ember from 'ember';
const {
    Component,
    computed,
    inject
} = Ember;
export default Component.extend({
    session: inject.service('session'),
    store: inject.service('store'),
    count: 12,
    brand: computed('session.brand.id', function() {
        return this.get("store").findRecord("brand", this.get("session.brand.id"));
    }),
    productsArr: computed('brand.id', function() {
        if (this.get('brand.id')) {
            return this.get("store").query("product", {
                'brand': this.get("brand.id")
            });
        }
        return [];
    }),
    details: computed('brand.description', 'brand.address', 'brand.city', 'brand.name', 'brand.phone', 'brand.postal', 'brand.logo', 'brand.timezone', 'brand.vertical.id', 'brand.country.id', 'brand.state.id', function() {
        const brand = this.get("brand");
        return !!(this.get("brand.description") &&
            !!this.get("brand.address") &&
            !!this.get("brand.city") &&
            !!this.get("brand.name") &&
            !!this.get("brand.phone") &&
            !!this.get("brand.postal") &&
            !!this.get("brand.logo") &&
            !!this.get("brand.timezone") &&
            !!this.get("brand.vertical.id") &&
            !!this.get("brand.country.id") &&
            !!this.get("brand.state.id"));
    }),
    social: computed('brand.socialAccounts.length', function() {
        return !!this.get("brand.socialAccounts.length");
    }),
    categories: computed('brand.categories.length', function() {
        return !!this.get("brand.categories.length");
    }),
    products: computed('productsArr.length', function() {
        return !!this.get('productsArr.length');
    }),
    team: computed('brand.brandMembers.length', function() {
        return !!this.get('brand.brandMembers.length');
    }),
    departments: computed('brand.departments.length', function() {
        return !!this.get('brand.departments.length');
    }),
    managers: computed('brand.allDepartmentsLed', function() {
        return !!this.get('brand.allDepartmentsLed');
    }),
    reviewChannels: computed('brand.reviewChannels.length', function() {
        return !!this.get('brand.reviewChannels.length');
    }),
    socialReview: computed('brand.foundSocialReviewChannel', function() {
        return !!this.get('brand.foundSocialReviewChannel');
    }),
    chat: computed('brand.chatRooms.length', function() {
        return !!this.get('brand.chatRooms.length');
    }),
    targetAudience: computed('brand.targetAudiences.length', function() {
        return !!this.get('brand.targetAudiences.length');
    }),
    defaultTargetAudience: computed('brand.defaultTargetAudience.id', function() {
        return !!this.get('brand.defaultTargetAudience.id');
    }),
    doneCount: computed('details', 'social', 'categories', 'products', 'team', 'departments', 'managers', 'reviewChannels', 'socialReview', 'chat', 'targetAudience', 'defaultTargetAudience', function() {
        return this.get('details') + this.get('social') + this.get('categories') + this.get('products') + this.get('team') + this.get('departments') + this.get('managers') + this.get('reviewChannels') + this.get('socialReview') + this.get('chat') + this.get('targetAudience') + this.get('defaultTargetAudience');
    }),
    donePerc: computed('count', 'doneCount', {get() {
            if (!!this.get("count")) {
                return Math.round((this.get("doneCount") / this.get("count")) * 100);
            }
            return 0;
        }
    }),
    actions: {
        link() {
            this.get("router").transitionTo("brand.edit.setup", this.get("session.company.id"), this.get("session.brand.id"));
        }
    }
});
