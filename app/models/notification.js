import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import {
	belongsTo
}
from 'ember-data/relationships';


export default Model.extend({
	body: attr(),
	subject: attr(),
	sendTime: attr(),
	seen: attr('to-boolean'),
	company: belongsTo('company'),
	brand: belongsTo('brand'),
	user: belongsTo('user'),
	timeAgo: attr(),
	posting: belongsTo('posting', {
		async: true
	}),
	actionId: attr('string'),
	actionType: attr('string'),
	handled: attr('to-boolean')

});
