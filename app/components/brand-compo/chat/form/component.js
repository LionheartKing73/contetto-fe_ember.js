import Ember from 'ember';

const {
  Component,
  get, set
} = Ember;

export default Ember.Component.extend({
  actions: {
    save(changeset) {
      let brand = get(this, 'changeset.brand');
      brand.get('chatRooms').then((rooms) => {
        const chatRoomNames = rooms.map((room) => {
          return get(room, 'name');
        });
        if(changeset.get('name').trim()==""){
          get(this, 'toast').error("Please enter a valid name", 'Failure');
          return;
        }
        if (!chatRoomNames.includes(get(changeset, 'name'))) {
          changeset.validate().then(() => {
          if (get(changeset, 'isValid')) {
            set(this, 'saving', true);

            changeset.save().then(room => {
              get(this, 'toast').success('Room saved successfully!', 'Success');
              this.transitionTo('brand.edit.chat.details', get(changeset, 'id'));
            }).finally(() => {
              set(this, 'saving', false);
            });
          }
        });
       } else {
         get(this, 'toast').error("Can't have 2 rooms with same name", 'Failure');
       }
     });
    }
  }
});
