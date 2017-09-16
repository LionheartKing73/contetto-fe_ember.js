import Ember from 'ember';
import BrandAuthorization from 'contetto/mixins/brand-authorization';

const {
  Route,
  RSVP: { hash }
} = Ember;

export default Route.extend(BrandAuthorization, {
  authorizationAttribute: 'manageReviewStructure',

  model(params) {
    return hash({
      brand: this.store.findRecord('brand', this.get('session.brand.id'))
    });
  },
  actions: {
    deleteChannel(id) {
      if (confirm("Are you sure you want to remove this review channel?")) {
        this.get('store').findRecord('reviewChannel', id).then((channel) => {
          channel.deleteRecord();
          channel.save().then(() => {

            this.get('toast').success('Channel deleted successfully!', 'Success');
            this.transitionTo('brand.edit.reviewflow.channels');
          });
        });
      }
    }
  }
});
