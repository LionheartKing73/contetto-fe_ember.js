import Ember from 'ember';
import Provider from 'torii/providers/base';
import {configurable} from 'torii/configuration';

const {
  isEmpty,
  inject: { service}
} = Ember;

export default Provider.extend({
  tokenParser: service('token-parser'),

  name: 'youtube-oauth2',

  requestTokenUri: configurable('requestTokenUri'),

  buildRequestTokenUrl() {
    return this.get('requestTokenUri');
  },

  open(options){
    let _this = this;
    let url = this.buildRequestTokenUrl();
    let responseParams = ['oauth_token'];

    return this.get('popup').open(url, responseParams, options).then(function(res) {

      if(isEmpty(res.oauth_token)) {
        throw new Error('Unable to get token');
      }

      Ember.set(res, 'type', 'youtube');

      _this.get('tokenParser').add(res);
    });
  },

  fetch(session) {
    return session;
  }
});
