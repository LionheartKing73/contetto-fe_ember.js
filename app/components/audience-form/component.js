import Ember from 'ember';
import {
	task,
	timeout
}
from 'ember-concurrency';

const {
	Component,
	set,
	get,
	inject,
	isEmpty,
	setProperties
} = Ember;

export default Component.extend({
	toast: inject.service(),
	store: inject.service(),

	init() {
		this._super(...arguments);
		let changeset = get(this, 'changeset');
		if (isEmpty(get(changeset, 'ageRanges'))) {
			set(changeset, 'ageRanges', get(this, 'recommendedAgeRanges'));
		}
		if (isEmpty(get(changeset, 'gender'))) {
			set(changeset, 'gender', get(this, 'recommendedGenders'));
		}
	},

	searchLocations: task(function*(term) {
		yield timeout(500);

		return this.get('store').query('location', {
			search: term,
			size: 500,
		});
	}).restartable(),

	actions: {
		save(changeset) {
			changeset.validate().then(() => {
				if (changeset.get('isValid')) {
					set(this, 'saving', true);
					changeset.save().then(() => {
						get(this, 'toast').success('Target Audience created successfully!', 'Success');
						this.transitionTo('brand.edit.targetaudience');
					}).finally(() => set(this, 'saving', false));
				}
			});
		},
		reset(changeset) {
			changeset.rollback();
		}
	}
});
