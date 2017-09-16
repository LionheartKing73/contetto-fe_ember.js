import Ember from 'ember';
import RequireSocialAccount from 'contetto/mixins/require-social-account';

const {
    Route,
} = Ember;

export default Route.extend(RequireSocialAccount, {

});
