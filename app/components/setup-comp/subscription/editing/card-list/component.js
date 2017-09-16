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
        Ember.$("tr.credit-card").click(function(){
            let index = $(this).attr('data-index');
            let plan = _this.get('cards').objectAt(index);
            _this.send('selectCard', plan);
        });
    },
    actions: {
        selectCard(card){
            this.selectCard(card);
        }
    }
});
