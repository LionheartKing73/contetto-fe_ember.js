import Ember from 'ember';
import AddRoute from 'contetto/home/brand/targetaudience/add/route';


const { get } = Ember;

export default AddRoute.extend({
  getAudienceModel({ audience_id }){
    return get(this, 'store').findRecord('audience', audience_id);
  }
});
