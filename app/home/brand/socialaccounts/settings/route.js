import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import accountValidations from 'contetto/validations/account';

const {
  get,
  set,
  isEmpty,
  Route,
  inject: { service }
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  torii: service('torii'),
  tokenParser: service('token-parser'),
  toast: service('toast'),

  model(params) {
    const accountId = params.accountId;

    return Ember.RSVP.hash({
      accountValidations,
      isLoading: false,
      account: this.store.findRecord('social-account', accountId)
    });
  },

  actions: {
    save(account) {
      const brandId = get(account, 'brand.id');

      account.validate().then(() => {
        set(this, 'currentModel.isLoading', true);

        if(get(account, 'isValid')) {
          account.save().then(() => {
            set(this, 'model.isLoading', false);
          }).finally(() => {
            this.transitionTo('brand.edit.socialaccounts.list', brandId);
          });
        }
      });
    },

    getProvider(platform, account) {
      switch(platform) {
        case 'reddit':
          this.renewToken('reddit-oauth2', account);
          break;
        case 'facebook':
          this.renewToken('facebook-oauth2', account);
          break;
        case 'twitter':
          this.renewToken('reddit-oauth1', account);
          break;
        case 'gplus':
          this.renewToken('google-oauth2', account);
          break;
        case 'linkedin':
          this.renewToken('linked-in-oauth2', account);
          break;
        case 'youtube':
          this.renewToken('reddit-oauth2', account);
          break;
        default:
          return false;
      }
    }
  },

  renewToken(provider, account) {
    const _this = this;
    const pageId = get(account, 'pageId');
    const platform = get(account, 'platform');

    set(this, 'currentModel.isLoading', true);

    this.get('torii').open(provider)
      .then(function() {
        let token = get(_this, 'tokenParser.data.0.token');

        //Check faecbook page token too
        if(platform === 'facebook' && !isEmpty(get(_this, 'tokenParser.data.0.pages'))) {

          get(_this, 'tokenParser.data.0.pages')
            .forEach(function(page) {

              if(pageId === get(page, 'id')) {
                token = get(page, 'attributes.token');
              }
            });
        }

        account.set('token', token);

        account.save().then(() => {
          get(_this, 'toast').success('Token has been successfully been renewed', 'Success');
        });
      }, function(){
        get(_this, 'toast').error('Unable to renew token', 'Error');
      }).then(() => {
        set(this, 'currentModel.isLoading', false);
      });
  }
});
