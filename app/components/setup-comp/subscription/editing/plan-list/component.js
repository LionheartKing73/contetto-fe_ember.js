import Ember from 'ember';

const {
    Component,
    set,
    get,
    inject,
    computed,
    isEmpty,
    RSVP
} = Ember;

export default Component.extend({
    didInsertElement(){
        let _this = this;
        Ember.$("tr.subscription-plan").click(function(){
            let index = $(this).attr('data-index');
            let plan = _this.get('plans').objectAt(index);
            _this.send('updateCurrentPlan', plan);
        });
    },
    actions: {
        updateCurrentPlan(plan){
            this.set('subscription.plan', plan);
        },
    }
});
