import Ember from 'ember';
import Oauth2 from 'torii/providers/oauth2-code';
import config from 'contetto/config/environment';

const {
  isEmpty,
  inject: { service}
} = Ember;

export default Oauth2.extend({
  tokenParser: service('token-parser'),

  name: 'google-oauth2',

  baseUrl: Ember.computed(function() {
    let url = 'https://gke.contetto.io/social-auth/v1/social-auth/gplus?state=add';

    if (config.MODE === 'test') {
     url = url + '&mode=dev';
    }

    return url;
  }),

  open: function(options){
    let _this = this;
    let url = this.get('baseUrl');
    let responseParams = ['oauth_token', 'pageId', 'pageTitle', 'code', 'state'];

    return this.get('popup').open(url, responseParams, options).then(function(res){

      if(isEmpty(res.oauth_token)) {
        throw new Error('Unable to get token');
      }

      Ember.set(res, 'type', 'gplus');

      _this.get('tokenParser').add(res);

      return res;
    });
  },

  fetch(session) {
    return session;
  }

});
