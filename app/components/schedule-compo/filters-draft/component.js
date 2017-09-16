import Ember from 'ember';

export default Ember.Component.extend({
    draftOptions: [{
        'name': 'All',
        'id': 'all'
    }, {
        'name': 'Exclude Drafts',
        'id': '-1'
    }, {
        'name': 'Only Drafts',
        'id': '1'
    }],
    draftSelected: {
        'name': 'All',
        'id': 'all'
    },
    didReceiveAttrs: function() {
        var self = this;
        if (this.get("draftSelected.id") != this.get("selectedDraft")) {
            //   alert('draft not match');
            this.get("draftOptions").map(function(d) {
                if (d.id == self.get("selectedDraft")) {
                    //      alert("d match");
                    self.set("draftSelected", d);
                }
                else {
                    //    alert(d.id + " not match" + self.get("selectedDraft"));
                }
            });
        }
    },
    actions: {
        changeDraft: function(draft) {
            this.set("draftSelected", draft);
            this.get("updateDrafts")(draft.id);
        }
    }
});
