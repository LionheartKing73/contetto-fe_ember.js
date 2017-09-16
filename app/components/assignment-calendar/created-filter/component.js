import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service('store'),
    brandUsers: [],
    init: function() {
        let component = this;
        component.set("brandUsers", []);
        this.get('brand.brandMembers').then((members) => {
            //     console.log("brand members!");
            members.forEach(function(member) {
                member.get('user').then((user) => {
                    component.get('brandUsers').pushObject(user);
                });
            });
        });
        return this._super();
    },
    actions: {
        changeCreated: function(created) {
            this.get("updateCreated")(created);
        }
    }
});
