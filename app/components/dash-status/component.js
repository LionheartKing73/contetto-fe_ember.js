import Ember from 'ember';

export default Ember.Component.extend({
    extraClass: Ember.computed('footer', 'title', function() {
        var className = "";

        if (!this.get('footer')) {
            className = "dash-status-";

            if (this.get("title")) {
                className += "nofooter";
            }
            else {
                className += "plain";
            }
        }

        return className;
    }),

    statusColor: Ember.computed("status", function() {

        var statusColor = "";

        if (this.get("status") == "danger") {
            statusColor = "orange";
        }
        else if (this.get("status") == "warning") {
            statusColor = "yellow";
        }
        else if (this.get("status") == "info") {
            statusColor = "water";
        }
        else if (this.get("status") == "success") {

            statusColor = "green";
        }
        else {
            statusColor = "blue";

        }


        return statusColor;

    }),

    statusIcon: Ember.computed('status', function() {
        var statusIcon = "";

        if (this.get("status") == "danger") {
            statusIcon = "fa-exclamation-circle";
        }
        else if (this.get("status") == "warning") {
            statusIcon = "fa-exclamation-triangle";
        }
        else if (this.get("status") == "info") {
            statusIcon = "fa-info-circle";
        }
        else if (this.get("status") == "success") {

            statusIcon = "fa-check-circle";
        }
        else {
            statusIcon = "fa-info-circle";

        }


        return statusIcon;
    }),
    actions: {
        click() {
            if (this.get("onclick")) {
                this.get("onclick")();
            }
        }
    }
});
