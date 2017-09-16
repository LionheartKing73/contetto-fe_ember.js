import Ember from 'ember';
import moment from 'moment';
import Base from 'ember-simple-auth/authenticators/base';
import config from 'contetto/config/environment';

const {
  isEmpty,
  inject: {
    service
  },
  get,
  set,
  RSVP,
  run
} = Ember;

export default Base.extend({
  session: service(),
  store: service(),
  toast: service(),
  ajax: service(),

  restore(data) {
    return new RSVP.Promise((resolve, reject) => {
      if (!isEmpty(data['X-Session'])) {
        //!! Mobile related functionality Please don;t remove. !!//
        window.parent.postMessage(data, "*");
        // restore session
        resolve(data);
      }
      else {
        reject();
      }
    });
  },

  authenticate(identification, password) {
    const tz = moment.tz.guess();
    const authenticator = this;

    return new RSVP.Promise((resolve, reject) => {
      get(this, 'ajax').request(`${config.REST.host}/users/v1/sessions`, {
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
          "data": {
            "type": "sessions",
            "attributes": {
              "email": identification,
              "password": password,
              "timezone": tz
            }
          }
        })
      }).then(response => {
        run(() => {
          const data = {
            'X-Session': response.data.id,
            'userId': response.data.relationships.users.data.id
          };
          set(authenticator, 'session.store.cookieExpirationTime', authenticator.computeSessionTimeout(response.data.attributes.sessionTimeout));

          //!! Mobile related functionality Please don;t remove. !!//
          window.parent.postMessage(data, "*");

          if (typeof android != "undefined") {
            if (typeof android.postMessage != "undefined") {
              android.postMessage(JSON.stringify(data));
            }
          }


          if (typeof window.webkit != "undefined") {
            if (typeof window.webkit.messageHandlers != "undefined") {
              if (typeof window.webkit.messageHandlers.userLogin != "undefined") {
                //   alert("Calling window.webkit.messageHandlers.userLogin");
                window.webkit.messageHandlers.userLogin.postMessage(data);
                // alert("Called done");
              }
            }
          }
          // validate session
          resolve(data);
        });
      }, response => {
        run(() => {
          let error = response && get(response, 'responseJSON.title') ? get(response, 'responseJSON.title') : 'Authentication failed. Please try again!';
          authenticator.get('toast').error(error);
          reject(error);
        });
      });
    });
  },

  invalidate(data) {
    return new RSVP.Promise(resolve => {
      get(this, 'ajax').request(`${config.REST.host}/users/v1/sessions`, {
        method: 'DELETE',
        contentType: 'application/json',
        headers: {
          'X-Session': data['X-Session']
        }
      }).finally(resolve);
    });
  },

  computeSessionTimeout(sessionTimeout) {
    if (sessionTimeout === 0) {
      // A really long expiration. Practically infinite.
      return (new Date("Fri, 31 Dec 9998 23:59:59 GMT").getTime() - new Date().getTime()) / 1000;
    }
    else if (sessionTimeout > 0) {
      // Convert minutes to seconds
      return sessionTimeout * 60;
    }
    else {
      // Session cookie. Will expire after the window is closed.
      return null;
    }
  }
});
