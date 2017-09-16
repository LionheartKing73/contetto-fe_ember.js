import Ember from 'ember';

export default Ember.Component.extend({
    didRender() {
        /*global $*/ 
        $("div.room-header").width($("div.main").width());    
    } 
});
