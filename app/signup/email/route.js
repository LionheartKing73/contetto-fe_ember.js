import Ember from 'ember';
import SignupValidations from 'contetto/validations/signup';

const {
  Route,
  get
} = Ember;

export default Route.extend({
  queryParams: {
    userEmail: {
      refreshModel: true
    },
    lpid: {
      refreshModel: true
    },
    hpid: {
      refreshModel: true
    },
    cid: {
      refreshModel: true
    },

    affiliateid: {
      refreshModel: true
    },
    eid: {
      refreshModel: true
    },
    lbid: {
      refreshModel: true
    }

  },

  model(params) {
    let email = "";
    if(params.email!="you@example.com"){
      email = params.email;
    }
    return {
      SignupValidations,
      user: this.store.createRecord('user', {
        email: email,
        lpid: params.lpid,
        hpid: params.hpid,
        cid: params.cid,
        affiliateId: params.affiliateid,
        eid: params.eid,
        lbid: params.lbid
      }),
      lpid: params.lpid,
      hpid: params.hpid,
      cid: params.cid,
      affiliateid: params.affiliateid,
      eid: params.eid,
      lbid: params.lbid

    };
  },

  deactivate() {
    if (get(this.currentModel, 'user.isNew')) {
      this.currentModel.user.destroyRecord();
    }
  }
});
