import Ember from 'ember';

export default Ember.Component.extend({

    actions: {
        selectFile(file) {
            this.get("select")(file);
        },
        moveFile(file) {
            this.get("moveFile")(file);
        },
        cancelMove(file) {
            this.get("cancelMove")(file);
        },
        deleteFile(file) {
            if (confirm("Are you sure you want to delete this file?")) {
                file.deleteRecord();
                file.save();
            }
        },
        renameFile(file) {
            var name = prompt("Enter new file name:", file.get("name"));
            if (name != null) {
                file.set("name", name);
                file.save();
            }
        }


    }
});
