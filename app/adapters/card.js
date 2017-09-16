import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  handleResponse(status, headers, payload) {
    if (status === 401 && get(this, 'session.isAuthenticated')) {
      get(this, 'session').invalidate();
    }
    else if (status === 400 || status === 0 || status === 403) {
      const errorMessage = payload.title || 'Server error!';
      this.get('toast').error("We could not validate your credit card information. Please ensure it is correct and has not expired.", 'Error');
    }
    else if (payload === null && status === 200) {
      payload = {
        data: []
      };
    }
    return payload;
  }
});
