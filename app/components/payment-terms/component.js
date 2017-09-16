import Ember from 'ember';

export default Ember.Component.extend({
    termsCheck: false,
    policyCheck: false,
    paymentCheckObs: Ember.observer('termsCheck', 'policyCheck', function() {
        this.set('paymentCheck', this.get('termsCheck') && this.get('policyCheck'));
    })
});
