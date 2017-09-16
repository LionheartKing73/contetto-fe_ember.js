import config from 'contetto/config/environment';
import Ajax from 'ember-ajax/services/ajax';

export default new function user() {
  return {
    ajax: Ajax.create(),
    host: config.REST.host,
    contentType: 'application/json; charset=utf-8',

    requestPasswordReset(email){
      return this.ajax.request(`${this.host}/users/v1/reset`, {
        method: 'POST',
        contentType: this.contentType,
        data: JSON.stringify({ data: { attributes: { email }, type: 'forgot-passwords' } })
      });
    },

    resetPassword(newPassword, token) {
      return this.ajax.request(`${this.host}/users/v1/pass`, {
        method: 'PATCH',
        contentType: this.contentType,
        data: JSON.stringify({ data: { attributes: { newPassword, token } } })
      });
    },

    verify(token) {
      return this.ajax.request(`${this.host}/users/v1/verifications?token=${token}`);
    }
  }
};
