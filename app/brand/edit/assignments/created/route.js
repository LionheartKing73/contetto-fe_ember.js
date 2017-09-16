import Ember from 'ember';
import RequireSocialAccount from 'contetto/mixins/require-social-account';

const {
    Route,
    inject
} = Ember;

export default Route.extend(RequireSocialAccount, {
    session: inject.service(),

    model() {
        return Ember.RSVP.hash({
            brand: this.store.findRecord('brand', this.get('session.brand.id')),
            assignments: this.store.query("changeRequest", {
                'requestBy': this.get('session.data.authenticated.userId'),
                'status': 1,
                'brand': this.get('session.brand.id')
            })
        });
    }
});
