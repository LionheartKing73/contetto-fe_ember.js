/* jshint node: true */
const toolbars = ['fullscreen', 'bold', 'italic', 'underline',
  'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily',
  'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'insertLink',
  'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|',
  'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent',
  'quote', '|', 'emoticons', 'specialCharacters', 'insertHR',
  'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help',
  'html', '|', 'undo', 'redo'
];
const toolbarsSm = ['fullscreen', 'bold', 'italic', 'underline',
  'fontFamily', 'fontSize', 'insertLink', 'insertImage', 'insertTable',
  'undo', 'redo'
];
const toolbarsXs = ['bold', 'italic', 'fontFamily', 'fontSize'];
const showTool = 'showTool';
const hideTool = 'hideTool';
const pluginsEnabled = ["align", "charCounter", "codeBeautifier", "codeView", "colors",
  "draggable", "emoticons", "entities", "file", "fontFamily", "fontSize",
  "fullscreen", "image", "imageManager", "inlineStyle", "lineBreaker", "link",
  "lists", "paragraphFormat", "paragraphStyle", "quote", "save",
  "table", "url", "video", "wordPaste"
];

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'contetto',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    toolbars: toolbars,
    toolbarsSm: toolbarsSm,
    toolbarsXs: toolbarsXs,
    showTool: showTool,
    hideTool: hideTool,
    'ember-froala-editor': {
      toolbarSticky: false,
      heightMin: 150,
      pluginsEnabled: pluginsEnabled,
      toolbarButtons: toolbars.concat([showTool, hideTool]),
      toolbarButtonsMD: toolbars,
      toolbarButtonsSM: toolbarsSm.concat([showTool]),
      toolbarButtonsXS: toolbarsXs.concat([showTool])
    },
    salt: "$2a$08$CONTETTORANDOMSALT1234",
    EmberENV: {
      ENABLE_DS_FILTER: true,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      emberModalDialog: {
        modalRootElementId: 'myModal'
      }
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    REST: {
      host: 'https://gke.contetto.io',
      // host: 'http://localhost:4200/api/',
      namespace: 'v1'
    },
    contentSecurityPolicy: {
      'script-src': "*",
      'font-src': "*",
      'connect-src': "'self' wss://contettochat-emac08.c9users.io:8081/",
      'style-src': "'self' https://contettochat-emac08.c9users.io:8081/",
      'object-src': "*",
      'img-src': "*"
    },
    /*'ember-simple-auth': {
      authenticationRoute: 'auth'
    },
*/
    moment: {
      outputFormat: 'LL',
      serverFormat: 'YYYY-MM-DD',
      // Options:
      // 'all' - all years, all timezones
      // '2010-2020' - 2010-2020, all timezones
      // 'none' - no data, just timezone API
      includeTimezone: 'all'
    }
  };



  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    // To identify the enviroment type
    ENV.MODE = 'test';

    ENV['torii'] = {
      providers: {
        'facebook-oauth2': {
          apiKey: '1039694122720349',
          redirectUri: 'http://localhost:4200'
        },
        'twitter-oauth1': {
          requestTokenUri: 'https://gke.contetto.io/social-auth/v1/social-auth/twitter?state=add&mode=dev',
        },
        'wordpress': {
          requestTokenUri: 'https://gke.contetto.io/social-auth/v1/social-auth/wordpress',
        },
        'reddit-oauth2': {
          requestTokenUri: 'https://gke.contetto.io/social-auth/v1/social-auth/reddit?state=add&mode=dev',
        },
        'google-oauth2': {
          requestTokenUri: 'https://gke.contetto.io/social-auth/v1/social-auth/gplus?state=add&mode=dev',
        },
        'linked-in-oauth2': {
          redirectUri: 'http://localhost:4200'
        },
        'youtube-oauth2': {
          requestTokenUri: 'https://gke.contetto.io/social-auth/v1/social-auth/youtube?state=add&mode=dev',
        }
      }
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.MODE = 'live';


    ENV['torii'] = {
      providers: {
        'facebook-oauth2': {
          apiKey: '1039694122720349',
          redirectUri: 'http://app.contetto.io'
        },
        'twitter-oauth1': {
          requestTokenUri: 'https://gke.contetto.io/social-auth/v1/social-auth/twitter?state=add',
        },
        'reddit-oauth2': {
          requestTokenUri: 'https://gke.contetto.io/social-auth/v1/social-auth/reddit?state=add',
        },
        'google-oauth2': {
          requestTokenUri: 'https://gke.contetto.io/social-auth/v1/social-auth/gplus?state=add',
        },
        'linked-in-oauth2': {
          redirectUri: 'http://app.contetto.io'
        },
        'youtube-oauth2': {
          requestTokenUri: 'https://gke.contetto.io/social-auth/v1/social-auth/youtube?state=add',
        },
        'wordpress': {
          requestTokenUri: 'https://gke.contetto.io/social-auth/v1/social-auth/wordpress',
        }
      }
    }
  }

  return ENV;
};
