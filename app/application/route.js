import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import ENV from 'contetto/config/environment';
const {
  toolbars,
  toolbarsSm,
  toolbarsXs,
  showTool,
  hideTool
} = ENV;
const {
  Route,
  get,
  inject: {
    service
  }
} = Ember;

export default Route.extend(ApplicationRouteMixin, {
  beforeModel: function(){
    Math.roundTwoDecimals = function(num){
      var val = Math.round(num*100)/100 + "";
      var arr = val.split(".");
      if(arr.length==2){
        if(arr[1].length==1){
          return val+="0";
        }
        else{
          return val;
        }
      }
      else{
        return val+".00";
      }
    }
  },
  afterModel: function(){
    ENV['ember-froala-editor']['imageManagerLoadURL']="https://gke.contetto.io/postings/v1/froala";
    ENV['ember-froala-editor']['requestHeaders']={};
    ENV['ember-froala-editor']['requestHeaders']['X-Session']=this.get("session.data.authenticated.X-Session");
    //
    ENV['ember-froala-editor']['imageUploadURL']="https://gke.contetto.io/files/v1/froala";
    ENV['ember-froala-editor']['image'] = {};
    ENV['ember-froala-editor']['image']['beforeUpload'] = function(e, editor, images){
      console.log(e);
      console.log(editor);
      console.log(images);
    };
  },
  init() {
    this._super(...arguments);
    Ember.$.FroalaEditor.DefineIcon(showTool, {
      NAME: 'angle-double-down'
    });
    Ember.$.FroalaEditor.RegisterCommand(showTool, {
      title: 'Show extra tools',
      callback: function() {
        const screenWidth = Ember.$(window).width();
        if (screenWidth <= 992) {
          let currentToolbars = [];
          if (screenWidth >= 768) {
            currentToolbars = toolbarsSm;
          }
          else {
            currentToolbars = toolbarsXs;
          }
          var commands = Ember.$(toolbars).not(currentToolbars).get();
          var that = this;
          commands.forEach(function(command) {
            that.$tb.find(`[data-cmd='${command}']`).removeClass('fr-hidden');
          });
          that.$tb.find(`[data-cmd='${hideTool}']`).removeClass('fr-hidden');
          that.$tb.find(`[data-cmd='${showTool}']`).addClass('fr-hidden');
        }
      }
    });
    Ember.$.FroalaEditor.DefineIcon(hideTool, {
      NAME: 'angle-double-up'
    });
    Ember.$.FroalaEditor.RegisterCommand(hideTool, {
      title: 'Hide extra tools',
      callback: function() {
        const screenWidth = Ember.$(window).width();
        if (screenWidth <= 992) {
          let currentToolbars = [];
          if (screenWidth >= 768) {
            currentToolbars = toolbarsSm;
          }
          else {
            currentToolbars = toolbarsXs;
          }
          var commands = Ember.$(toolbars).not(currentToolbars).get();
          var that = this;
          commands.forEach(function(command) {
            that.$tb.find(`[data-cmd='${command}']`).addClass('fr-hidden');
          });
          that.$tb.find(`[data-cmd='${hideTool}']`).addClass('fr-hidden');
          that.$tb.find(`[data-cmd='${showTool}']`).removeClass('fr-hidden');
        }
      }
    });
  },
  session: service('session'),

  sessionInvalidated() {
    this._super(...arguments);
  },

  actions: {
    logout() {
      get(this, 'session').invalidate();
    },
    transitionTo() {
      this.transitionTo(...arguments);
    }
  }
});
