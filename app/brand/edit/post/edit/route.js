import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import PostingValidations from 'contetto/validations/posting';
export default Ember.Route.extend(AuthenticatedRouteMixin, {
    toast: Ember.inject.service(),
    ajax: Ember.inject.service('ajax'),
    model(params) {

        const {
            brand_id
        } = this.paramsFor('brand.edit');
        const _this = this;


        return Ember.RSVP.hash({
            brandId: brand_id,
            brand: this.store.findRecord('brand', brand_id),
            PostingValidations,
            post: this.store.findRecord('posting', params.post_id),
            campaigns: this.store.query('campaign', {
                brand: brand_id
            }),
            accounts: this.store.query('social-account', {
                brand: brand_id
            }),
            categories: this.store.query('category', {
                brand: brand_id
            })
        }).catch((error) => {
          if (error.status === "400") {
            this.get('toast').error('The post that you are looking for seems to be deleted!');
            this.transitionTo('brand.edit.dashboard');
          }
        });
    }

});
