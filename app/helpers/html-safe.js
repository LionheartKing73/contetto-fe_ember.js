import Ember from 'ember';

export function htmlSafe(params) {
 return Ember.String.htmlSafe(params[0]);
}

export default Ember.Helper.helper(htmlSafe);
