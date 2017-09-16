import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service('store'),
    users: [],
    init: function() {
        let component = this;
        component.set("users", []);
        this.get('brand.brandMembers').then((members) => {
            //    console.log("brand members!");
            members.forEach(function(member) {
                member.get('user').then((user) => {
                    component.get('users').pushObject(user);
                });
            });
        });
        return this._super();
    },
    actions: {
        changeUsers: function(users) {
            this.get("updateUsers")(users);
        }
    }
});
