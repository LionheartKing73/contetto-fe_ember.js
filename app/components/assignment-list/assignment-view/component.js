import Ember from 'ember';

const {
  Component,
  inject: {
    service
  }
} = Ember;

export default Ember.Component.extend({
  store: service(),
  quickpost: Ember.inject.service("quickpost"),

  editingMode: false,
  session: service(),
  init: function() {
    this._super();
    this.set("editingMode", false);



  },
  assignedByMe: Ember.computed('session.data.authenticated.userId', 'assignmend.requestBy.id', function() {
    return (this.get('assignment.requestBy.id') == this.get('session.data.authenticated.userId'));
  }),
  assignedToMe: Ember.computed('session.data.authenticated.userId', 'assignmend.assignedToUser.id', function() {
    return (this.get('assignment.assignedToUser.id') == this.get('session.data.authenticated.userId'));
  }),
  canEdit: Ember.computed('assignedByMe', 'session.currentCompanyRole.overrideReviewStructure', function() {
    if (this.get("assignedByMe")) {
      return true;
    }
    return this.get('session.currentCompanyRole.overrideReviewStructure');

  }),
  canComplete: Ember.computed('assignedByMe', 'assignedToMe', 'session.currentCompanyRole.overrideReviewStructure', function() {
    if (this.get("assignedByMe")) {
      return true;
    }
    if (this.get("assignedToMe")) {
      return true;
    }
    return this.get('session.currentCompanyRole.overrideReviewStructure');

  }),
  updateTime: function(dt) {
    this.set("assignment.requestDue", dt);
  },
  actions: {
    save() {
      var self = this;
      this.get("assignment").save().then(function() {
        self.set("editingMode", false);
      });
    },
    updateDT(dt) {
      Ember.run.once(this, 'updateTime', dt);

    },
    edit() {
      this.set("editingMode", true);
    },
    cancelEdit() {
      this.get("assignment").rollbackAttributes();
      this.set("editingMode", false);

    },
    addCRFile(file) {
      this.get("assignment.files").pushObject(file);
    },
    removeCRFile(file) {
      this.get("assignment.files").removeObject(file);
    },
    manage(post) {
      this.get("quickpost").editPost(post);
    },

    completeAssignment(assignment) {
      if (assignment.get("status.id") === '2') {
        return;
      }

      this.get('store').findRecord('changeRequestStatus', 2).then((status) => {
        this.removeAssignment(assignment);
        assignment.set("status", status);
        assignment.save();
      });
    }
  }
});
/*

assignment tab -- show assignments, click post, ability to reassign/request review:
	-- user permission check for schedule button
		-- schedule button marks CR complete, draft false, status schedule
	-- display changerequest history
	-- assign as task becomes  if postcreator != current user  submit for review
		-- creates new CR, marks current CR complete, sets assignedTo to the requestBy value of previous CR*/
