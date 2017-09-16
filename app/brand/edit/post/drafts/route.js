import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import PostingValidations from 'contetto/validations/posting';
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  ajax: Ember.inject.service('ajax'),
  session: Ember.inject.service('session'),
  model(params) {

    const {
      brand_id
    } = this.paramsFor('brand.edit');

    const currentUserId = this.get('session.data.authenticated.userId');

    const options3 = {
      data: {
        brand: brand_id,
        isDraft: 1
      }
    };

    return Ember.RSVP.hash({
      brandId: brand_id,
      brand: this.store.findRecord('brand', brand_id),
      drafts: this.get('store').filter('postingSchedule', options3.data, function(postingSchedule) {
        return postingSchedule.get('posting.isDraft') && postingSchedule.get('posting.brand.id')==brand_id;
      })
    });
  }

});
