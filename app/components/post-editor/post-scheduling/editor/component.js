import Ember from 'ember';

export default Ember.Component.extend({
	ajax: Ember.inject.service('ajax'),
	postModes: [{
		'value': 'auto',
		'name': 'Automatically'
	}, {
		'value': 'now',
		'name': 'Now'
	}, {
		'value': 'specify',
		'name': 'Specify Time'
	}],
	showModeEditor: Ember.computed('rcid', 'assigning', 'changeSet.networkType', 'postSchedule', 'hasPending', 'mode', {get() {
			if (this.get('assigning')) {
				//			console.log("TRUE:assigning");
				return true;
			}
			if (this.get('hasPending')) {
				//			console.log("TRUE:pending");
				return true;
			}
			if (this.get('mode') == 'individual') {
				//			console.log("rcid " + this.get('rcid'));
				return this.get('rcid');
			}
			else {
				//			console.log("TRUE:not indi");

				return true;
			}

		}
	}),
	rcid: false,
	currentPSMode: null,
	currentMode: null,
	accountName: Ember.computed('mode', 'postSchedule', {get() {
			if (this.get("deleted")) {
				return false;
			}

			if (this.get('mode') == "individual") {
				return this.get('postSchedule.socialAccount.title');
			}
			else {
				return "All Selected Accounts";
			}
		}
	}),
	defaultDT: Ember.computed('postSchedule', 'scheduleLastTime', {get() {
			if (this.get("deleted")) {
				return false;
			}

			if (this.get('postSchedule') == null) {
				return this.get('scheduleLastTime');
			}
			else {
				return this.get('postSchedule.dateTime');
			}
		}
	}),
	specify: false,

	init: function() {
		if (this.get("postSchedule")) {
			if (this.get("postSchedule.dateTime") == null) {
				if (this.get("postSchedule.auto") == null || this.get("postSchedule.auto") == undefined) {
					if (this.get("postSchedule.tempTime")) {
						this.set("postSchedule.auto", this.get("postSchedule.tempTime"));
					}
				}
			}
		}
		return this._super();
	},
	didInsertElement: function() {

		var compo = this;
		if (this.get("mode") == "individual") {
			if (this.get('changeSet.networkType.name') == "Sales") {

				compo.get('postSchedule.socialAccount.marketingPostScheduleMode').then((mpsm) => {
					//	console.log("MPSM " + mpsm);
					if (mpsm != null) {
						compo.set('rcid', true);
					}
				});



			}
			else {

				compo.get('postSchedule.socialAccount.engagementPostScheduleMode').then((epsm) => {
					//		console.log("EPSM " + epsm);
					if (epsm != null) {
						compo.set('rcid', true);
					}
				});


			}
		}

		if (this.get('postSchedule') == null) {
			this.doSetPSMode({

				"id": null,

				"name": "Use Account Settings"

			});
		}
		else {




			this.get('postSchedule.postingScheduleMode').then((psm) => {

				if (psm == null) {
					this.doSetPSMode({

						"id": null,

						"name": "Use Account Settings"

					});
				}
				else {
					this.doSetPSMode(psm);
				}
			});
		}


		if (this.get('mode') == "individual") {
			if (this.get("postSchedule.now") === true) {
				this.doSetMode({
					'value': 'now',
					'name': 'Now'
				});
			}
			else {
				if (this.get("postSchedule.dateTime") == null) {
					//		alert("dsm auto i");
					this.doSetMode({
						'value': 'auto',
						'name': 'Automatically'
					});
				}
				else {
					this.doSetMode({
						'value': 'specify',
						'name': 'Specify Time'
					});
				}
			}
		}
		else {
			//alert("bulk");
			//			 scheduleIsMulti=scheduleIsMulti schedulePostMode=schedulePostMode scheduleAllNow=scheduleAllNow scheduleAllAuto=scheduleAllAuto
			if (this.get("scheduleIsMulti") == null) {
				//	alert("null sim");
				this.doSetMode({
					'value': 'auto',
					'name': 'Automatically'
				});
			}
			else {
				//alert("nns");
				if (this.get("scheduleAllNow") === true) {
					//alert("san true" + this.get("scheduleAllNow"));
					this.doSetMode({
						'value': 'now',
						'name': 'Now'
					});
				}
				else {
					if (this.get("scheduleAllAuto") === true) {
						//	alert("aa");
						this.doSetMode({
							'value': 'auto',
							'name': 'Automatically'
						});
					}
					else {
						//	alert("naa");
						this.doSetMode({
							'value': 'specify',
							'name': 'Specify Time'
						});
					}
				}
			}
		}


	},
	single: Ember.computed('mode', 'postSchedule', {get() {
			if (this.get('mode') == "individual") {
				return true;
			}
			return false;
		}
	}),
	noauto: false,
	accounts: Ember.computed('changeSet.socialAccounts', 'changeSet.postingSchedules', {get() {
			if (this.get("deleted")) {
				return false;
			}

			return this.get("changeSet.socialAccounts.length");
		}
	}),
	didReceiveAttrs() {
		this.updateAuto();
	},
	auto: Ember.computed('currentMode', {get() {
			if (this.get('currentMode.value') == "auto") {
				return true;
			}
			return false
		}
	}),
	doSetMode: function(mm) {
		this.set("currentMode", mm);
		if (mm.value == "specify") {
			this.set("specify", true);
		}
		else {
			this.set("specify", false);
		}

		if (mm.value == "now") {
			this.doUpdateTime(new Date());
			this.doUpdateNow(true);
		}
		else {
			this.doUpdateNow(false);
		}



		if (mm.value == "auto") {

			//                                                    this.get('ajax').request('https://gke.contetto.io/postings/v1/postTime?brand='+component.get('changeSet.brand.id')+'&account='+ps.get('socialAccount.id')+'&networkTypeId='+component.get('changeSet.networkType.id')).then(response => {

			this.doUpdateTime(null);
			this.updateAuto();
		}
	},
	doSetPSMode: function(mm) {
		this.set("currentPSMode", mm);
		if (this.get("mode") === "individual") {
			if (this.get("postSchedule.isPosted")) {

			}
			else {
				//			console.log("Update individual psmode [" + this.get("postSchedule.socialAccount.title") + "] to " + mm.id);
				if (mm.id == null) {
					this.set("postSchedule.postingScheduleMode", null);
				}
				else {
					this.set("postSchedule.postingScheduleMode", mm);

				}
			}
		}
		else {
			this.get('changeSet.postingSchedules').forEach(function(ps) {
				//	console.log("Update bulk ps for " + ps.get("socialAccount.title") + " to " + mm.id);
				if (ps.get("isPosted")) {

				}
				else {
					if (mm.id == null) {
						ps.set("postingScheduleMode", null);
					}
					else {
						ps.set("postingScheduleMode", mm);

					}
				}
			});
		}
		this.get('updateWarnings')();
	},
	updateAuto() {
		const component = this;
		this.set('noauto', false);

		if (this.get("mode") === "individual") {
			if (this.get("postSchedule.isPosted")) {

			}
			else {
				this.get('ajax').request('https://gke.contetto.io/postings/v1/postTime?brand=' + component.get('changeSet.brand.id') + '&account=' + component.get('postSchedule.socialAccount.id') + '&type=' + component.get('changeSet.networkType.id')).then(response => {
					var s = JSON.stringify(response);
					var o = JSON.parse(s);
					if (!o.data.attributes.dateTime) {
						component.set('noauto', true);
						component.doSetMode({
							'value': 'specify',
							'name': 'Specify Time'
						});
					}
					component.set("postSchedule.auto", o.data.attributes.dateTime);
					component.get('updateWarnings')();
				});
			}
		}
		else {
			//	console.log("auto for multi");

			var items = this.get('changeSet.postingSchedules'),
				list = items.toArray();
			list.forEach(function(ps) {
				if (ps.get("isPosted")) {

				}
				else {
					//		console.log("Auto for ps");
					component.get('ajax').request('https://gke.contetto.io/postings/v1/postTime?brand=' + component.get('changeSet.brand.id') + '&account=' + ps.get('socialAccount.id') + '&type=' + component.get('changeSet.networkType.id')).then(response => {
						var s = JSON.stringify(response);
						var o = JSON.parse(s);
						if (!o.data.attributes.dateTime) {
							component.set('noauto', true);
							component.doSetMode({
								'value': 'specify',
								'name': 'Specify Time'
							});
						}
						ps.set('auto', o.data.attributes.dateTime);
						component.get('updateWarnings')();
					});
				}
			});
		}
	},
	doUpdateTime: function(time) {
		var comp = this;
		if (this.get("mode") === "individual") {
			if (this.get("postSchedule.isPosted")) {}
			else {
				//console.log("Update individual [" + this.get("postSchedule.socialAccount.title") + "] to " + time);
				this.set("postSchedule.dateTime", time);
				this.get('updateWarnings')();
			}
		}
		else {
			this.get('changeSet.postingSchedules').forEach(function(ps) {
				if (ps.get("isPosted")) {

				}
				else {
				//	console.log("Update bulk ps for " + ps.get("socialAccount.title") + " to " + time);
					ps.set("dateTime", time);
					comp.get('updateWarnings')();
				}
			});
		}
	},
	doUpdateNow: function(now) {
		var comp = this;
		if (this.get("mode") === "individual") {
			if (this.get("postSchedule.isPosted")) {

			}
			else {
			//	console.log("Update individual [" + this.get("postSchedule.socialAccount.title") + "] now to " + now);
				this.set("postSchedule.now", now);
				this.get('updateWarnings')();
			}
		}
		else {
			this.get('changeSet.postingSchedules').forEach(function(ps) {
				if (ps.get("isPosted")) {}
				else {
			//console.log("Update bulk ps now for " + ps.get("socialAccount.title") + " to " + now);
					ps.set("now", now);
					comp.get('updateWarnings')();
				}
			});
		}

	},

	doAllNow: function() {
		this.get("allNowAction")();
	},
	actions: {
		setSpecified: function(ps, time) {
			this.set("currentMode", {
				'value': 'specify',
				'name': 'Specify Time'
			});
			this.set("specify", true);
			this.get("setSpecified")(ps, time);


		},
		setPSMode: function(mm) {
			this.doSetPSMode(mm);
		},
		setMode: function(mm) {
			this.doSetMode(mm);
			this.doAllNow();
			this.updateAuto();
		},
		updateTime: function(time) {
			this.doUpdateTime(time);
		},

	}

});
