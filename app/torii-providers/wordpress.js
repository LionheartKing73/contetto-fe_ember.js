import Ember from 'ember';
import Provider from 'torii/providers/base';
import {
    configurable
}
from 'torii/configuration';

const {
    isEmpty,
    inject: {
        service
    }
} = Ember;

export default Provider.extend({
    tokenParser: service('token-parser'),

    name: 'wordpress',

    requestTokenUri: configurable('requestTokenUri'),

    buildRequestTokenUrl() {
        return this.get('requestTokenUri');
    },
    urlencode: function(str) {
        //       discuss at: http://locutus.io/php/urlencode/
        //      original by: Philip Peterson
        //      improved by: Kevin van Zonneveld (http://kvz.io)
        //      improved by: Kevin van Zonneveld (http://kvz.io)
        //      improved by: Brett Zamir (http://brett-zamir.me)
        //      improved by: Lars Fischer
        //         input by: AJ
        //         input by: travc
        //         input by: Brett Zamir (http://brett-zamir.me)
        //         input by: Ratheous
        //      bugfixed by: Kevin van Zonneveld (http://kvz.io)
        //      bugfixed by: Kevin van Zonneveld (http://kvz.io)
        //      bugfixed by: Joris
        // reimplemented by: Brett Zamir (http://brett-zamir.me)
        // reimplemented by: Brett Zamir (http://brett-zamir.me)
        //           note 1: This reflects PHP 5.3/6.0+ behavior
        //           note 1: Please be aware that this function
        //           note 1: expects to encode into UTF-8 encoded strings, as found on
        //           note 1: pages served as UTF-8
        //        example 1: urlencode('Kevin van Zonneveld!')
        //        returns 1: 'Kevin+van+Zonneveld%21'
        //        example 2: urlencode('http://kvz.io/')
        //        returns 2: 'http%3A%2F%2Fkvz.io%2F'
        //        example 3: urlencode('http://www.google.nl/search?q=Locutus&ie=utf-8')
        //        returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-8'
        str = (str + '')
            // Tilde should be allowed unescaped in future versions of PHP (as reflected below),
            // but if you want to reflect current
            // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A')
            .replace(/%20/g, '+')
    },
    open(options) {
        let _this = this;
        let url = this.buildRequestTokenUrl();
        let responseParams = ['oauth_token', 'pageId', 'pageTitle', 'oauth_token_secret'];

        return this.get('popup').open(url, responseParams, options).then(function(res) {

            if (isEmpty(res.oauth_token)) {
                throw new Error('Unable to get token');
            }

            Ember.set(res, 'type', 'wordpress');

            _this.get('tokenParser').add(res);



            return new Ember.RSVP.Promise(function(resolve, reject) {
                Ember.$.ajax({
                    type: "GET",
                    url: "https://gke.contetto.io/social-auth/v1/social-auth/wordpresspages?token=" + _this.urlencode(res.token),
                    headers: {
                        'Accept': "application/json",
                    },
                    contentType: 'application/json',
                    data: ''
                }).then(function(response) {
                    Ember.set(res, 'pages', response.data);

                    _this.get('tokenParser').add(res);

                    resolve(res);
                }, function(err) {
                    reject(err);
                });
            });

        });
    },

    fetch(session) {
        return session;
    }
});
