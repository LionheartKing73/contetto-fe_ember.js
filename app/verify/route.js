import Ember from 'ember';
import User from 'contetto/utils/user';

const {
  Route,
  RSVP
} = Ember;

export default Route.extend({
  model({ token }){
    return new RSVP.Promise(resolve => User.verify(token).then(resolve).catch(error => resolve({ error })));
  }
});
