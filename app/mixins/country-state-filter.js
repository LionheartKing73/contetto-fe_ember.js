import Ember from 'ember';
import RSVP from 'rsvp';

const {
    get,
    computed,
    set,
    isEmpty
} = Ember;

export default Ember.Mixin.create({
    _countries: null,
    countries: computed({
        get() {
            let _countries = get(this, '_countries');
            if (!_countries) {
                const locationsObject = get(this, 'model.locations');
                _countries = locationsObject.filter(
                    (location) => get(location, 'targetType') === 'Country');
                set(this, '_countries', _countries);
            }
            return _countries;
        }
    }),
    states: computed('changeset.country.id', function() {
        const countryId = get(this, 'changeset.country.id');
        return isEmpty(countryId) ? RSVP.resolve() : get(this, 'store').query('location', {
            country: countryId
        });
    }),
    statesFulfilled: computed('states.isFulfilled', function() {
        const states = get(this, 'states');
        if (get(states, 'isFulfilled')) {
            return get(states, 'content');
        }
        else {
            return [];
        }
    }),
});
