import Ember from 'ember';

export default Ember.Component.extend({

	multiModes: [{
		'value': false,
		'name': 'at the same time'
	}, {
		'value': true,
		'name': 'at different times'
	}],
	multiMode: false,
	multiModeItem: {
		'value': false,
		'name': 'at the same time'
	},
	children: [],
	init: function() {





		return this._super();
	},
	didInsertElement() {
		if (this.get("schedulePostMode") != null) {
			if (this.get("schedulePostMode") == "specify") {
				this.set("multiMode", true);
				this.set("multiModeItem", {
					'value': true,
					'name': 'at different times'
				});
			}
		}
		if (this.get("scheduleIsMulti")) {
			this.set("multiMode", true);
			this.set("multiModeItem", {
				'value': true,
				'name': 'at different times'
			});
		}

	},
	actions: {
		setSpecified: function(ps, time) {
			//	alert('3- time: ' + time);
			ps.set('dateTime', time);

			this.get('setMultiAccount')(true);

			this.set("multiMode", true);
			this.set("multiModeItem", {
				'value': true,
				'name': 'at different times'
			});

			this.set("scheduleAllAuto", false);
			ps.set('dateTime', time);


		},
		setMulti: function(mm) {
			this.set("multiMode", mm.value);
			this.set("multiModeItem", mm);
		},
		allNowAction: function() {

			this.get("allNowAction")();
		}
	}

});
