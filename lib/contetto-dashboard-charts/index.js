/*jshint node:true*/
var EngineAddon = require('ember-engines/lib/engine-addon');
var MergeTrees = require('broccoli-merge-trees');
var CompileSass = require('broccoli-sass');

module.exports = EngineAddon.extend({
  name: 'contetto-dashboard-charts',
  lazyLoading: false,

  isDevelopingAddon: function() {
    return true;
  },

  treeForAddon(tree) {
    var defaultTree = this._super.treeForAddon.call(this, tree);
    var compiledSassTree = new CompileSass([tree], 'styles/contetto-dashboard-charts.scss', this.name + '.css');
    return new MergeTrees([defaultTree, compiledSassTree]);
  }
});
