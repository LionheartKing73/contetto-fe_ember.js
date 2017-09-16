import DS from 'ember-data';
import attr from 'ember-data/attr';

export default DS.Model.extend({
  comments: attr('number'),
  date: attr('date'),
  fanCount: attr('number'),
  favorites: attr('number'),
  likes: attr('number'),
  network: attr('string'),
  newLikes: attr('number'),
  retweets: attr('number'),
  shares: attr('number'),
  talkingAbout: attr('number')
});
