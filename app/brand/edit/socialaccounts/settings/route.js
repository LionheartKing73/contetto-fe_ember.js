import Ember from 'ember';
import BrandAuthorization from 'contetto/mixins/brand-authorization';
import accountValidations from 'contetto/validations/account';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

const {
  get,
  set,
  isEmpty,
  Route,
  inject: {
    service
  }
} = Ember;

export default Route.extend(BrandAuthorization, {
  torii: service('torii'),
  tokenParser: service('token-parser'),
  toast: service('toast'),
  authorizationAttribute: 'manageSocialAccounts',
  authorizationFailedRoute: 'brand.edit.socialaccounts',


  model(params) {
    const accountId = params.accountId;
    var account = this.store.findRecord('social-account', accountId);
    return Ember.RSVP.hash({
      // accountValidations,
      isLoading: false,
      postingScheduleModes: this.store.findAll('postingScheduleMode'),
      account: account,
      // changeset: new Changeset(account, lookupValidator(accountValidations), accountValidations)
    });
  },
  validate(account){
    if(!account.get('title') || !account.get('title').trim()){
      return false;
    }
    if(!account.get('readyOffset') || !parseInt(account.get('readyOffset'))>0){
      return false;
    }
    return true;
  },

  actions: {
    willTransition: function(transition){
      if(!Object.keys(this.currentModel.account.changedAttributes()).length){
        return true;
      }
      else if(confirm("Your information will be lost, if you exit this page. Are you sure?")){
        return true;
      }
      else{
        transition.abort();
      }
    },
    save(account) {
      const brandId = get(account, 'brand.id');
      let validation = this.validate(account);
      if(validation){
        set(this, 'currentModel.isLoading', true);
        account.save().then(() => {
          get(this, 'toast').success('Account Settings has been successfully saved', 'Success');
          set(this, 'model.isLoading', false);
          this.transitionTo('brand.edit.socialaccounts.list', brandId);
        }).catch(() => {
          get(this, 'toast').success('Account Settings could not be saved', 'Failure');
          set(this, 'model.isLoading', false);
        });
      }
      else{
        get(this, 'toast').error('Please enter the fields properly');
      }
    },

    getProvider(platform, account) {
      switch (platform) {
        case 'reddit':
          this.renewToken('reddit-oauth2', account);
          break;
        case 'facebook':
          this.renewToken('facebook-oauth2', account);
          break;
        case 'twitter':
          this.renewToken('twitter-oauth1', account);
          break;
        case 'gplus':
          this.renewToken('google-oauth2', account);
          break;
        case 'linkedin':
          this.renewToken('linked-in-oauth2', account);
          break;
        case 'youtube':
          this.renewToken('youtube-oauth2', account);
          break;
        case 'wordpress':
          this.renewToken('wordpress', account);
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
        if (platform === 'facebook' && !isEmpty(get(_this, 'tokenParser.data.0.pages'))) {

          get(_this, 'tokenParser.data.0.pages')
            .forEach(function(page) {

              if (pageId === get(page, 'id')) {
                token = get(page, 'attributes.token');
              }
            });
        }

        account.set('token', token);
        if (platform == 'twitter') {
          account.set('tokenSecret',
            _this.get('tokenParser.data.0.tokenSecret')
          );
        }

        account.save().then(() => {
          get(_this, 'toast').success('Token has been successfully been renewed', 'Success');
        });
      }, function() {
        get(_this, 'toast').error('Unable to renew token', 'Error');
      }).then(() => {
        set(this, 'currentModel.isLoading', false);
      });
  }
});
