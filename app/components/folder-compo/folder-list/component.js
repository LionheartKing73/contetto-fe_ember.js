import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        selectFolder(folder) {
            this.get("select")(folder);
        },
        deleteFolder(folder) {
            if (confirm("Are you sure you want to delete this folder, and it's files? Some may be in use by pending posts!")) {
                folder.deleteRecord();
                folder.save();
            }
        },
        moveFile(folder) {
            this.get("moveFile")(this.get("movingFile"), folder);
        },
        renameFolder(folder) {
            var name = prompt("Enter new folder name:", folder.get("name"));
            if (name != "" && name != null) {
              name = name.trim();
              var duplicate = false;
              var folders = this.get('folders').forEach(function(folder) {
                  if (folder.get("name") == name) {
                      duplicate = true;
                      return;
                  }
              });
            }
            if (!duplicate) {
              folder.set("name", name);
              folder.save();
            }
            else{
              alert("You entered a duplicate name for folder. Please use another name");
            }
        }

    }
});
