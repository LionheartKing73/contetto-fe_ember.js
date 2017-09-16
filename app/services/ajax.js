import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';
import config from 'contetto/config/environment';

export default AjaxService.extend({
  host: config.REST.host,
  session: Ember.inject.service(),
  headers: Ember.computed('session.data.authenticated.X-Session', {
    get() {
      let headers = {};
      const xsession=this.get('session.data.authenticated.X-Session');
        headers['x-session'] = xsession;
      return headers;
    }
  })
});