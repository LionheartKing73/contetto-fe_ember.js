import Ember from 'ember';
import ENV from 'contetto/config/environment';

const {
  Route,
  inject,
  set,
  get
} = Ember;

export default Route.extend({
  breadCrumb: null,
  session: inject.service(),
  model({
    brand_id
  }) {
    return this.store.findRecord('brand', brand_id);
  },
  setFroalaImageParameters(){
    ENV['ember-froala-editor']['imageUploadParams'] = {
        'bucket': "contetto-brand-" + this.get("session.brand.id"),
        'public': 1
    };
  },
  afterModel(model) {
    var title = "";
    var logo = get(model, 'logo');
    if (logo != "") {
      //title += "<img src='" + logo + "' class='img-circle' style='max-width:30px; max-height:30px'>";
    }
    title += get(model, 'name');
    set(this, 'breadCrumb', {
      title: title,
      linkable: true
    });

    const userId = get(this, 'session.data.authenticated.userId');

    // Loading all necessary models for brand before setting
    // session.brand for efficiency.
    return Ember.RSVP.all([
      // Brand Members
      model.get('brandMembers').then((members) => {
        const currentMember = members.findBy('user.id', userId);

        return get(currentMember, 'brandRole').then((role) => {
          set(this, 'session.currentBrandRole', role);
        });
      }),
      // Social Accounts
      this.store.query('socialAccount', {
        brand: get(model, 'id')
      }),
      // Network Types
      this.store.findAll('networkType'),
      // Postings
      this.store.query('posting', {
        brand: get(model, 'id')
      }),
      // Campaigns
      this.store.query('campaign', {
        brand: get(model, 'id')
      }),
      //Categories
      this.store.query('category', {
        brand: get(model, 'id')
      }),
      // Audience
      this.store.query('audience', {
        brand: get(model, 'id')
      }),
      // Review Channel
      this.store.query('review-channel', {
        brand: get(model, 'id')
      }),
      // Department
      this.store.query('department', {
        brand: get(model, 'id')
      }),
      // Users
      this.store.query('user', {
        brand: get(model, 'id')
      }),
      // Chat Rooms
      this.store.query('chat-room', {
        brand: get(model, 'id')
      }),
      // Tags
      this.store.query('tag', {
        brand: get(model, 'id')
      })
    ]).then(() => {
      set(this, 'session.brand', model);
      this.setFroalaImageParameters();
    });
  }
});
