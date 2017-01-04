/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';

/**
 * Example of Require.js boostrap javascript
 */

requirejs.config(
{
  baseUrl: 'js',

  // Path mappings for the logical module names
  paths:
  //injector:mainReleasePaths
  {
    'knockout': 'libs/knockout/knockout-3.4.0.debug',
    'jquery': 'libs/jquery/jquery-3.1.0',
    'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.0',
    'promise': 'libs/es6-promise/es6-promise',
    'hammerjs': 'libs/hammer/hammer-2.0.8',
    'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.0',
    'ojs': 'libs/oj/v2.2.0/debug',
    'ojL10n': 'libs/oj/v2.2.0/ojL10n',
    'ojtranslations': 'libs/oj/v2.2.0/resources',
    'text': 'libs/require/text',
    'signals': 'libs/js-signals/signals'
  }
  //endinjector
,
// Shim configurations for modules that do not expose AMD
  shim:
  {
    'jquery':
    {
      exports: ['jQuery', '$']
    }
  }
});

/**
* A top-level require call executed by the Application.
* Although 'ojcore' and 'knockout' would be loaded in any case (they are specified as dependencies
* by the modules themselves), we are listing them explicitly to get the references to the 'oj' and 'ko'
* objects in the callback
*/
require(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout','ojs/ojmodule','ojs/ojrouter'],
  function (oj, ko, $) { // this callback gets executed when all required modules are loaded

    // Router Instance and Configuration
    var router = oj.Router.rootInstance;
    router.configure({
      'home': {value:'home', isDefault: true},
      'decision': {value:'decision',
          exit: function () {
            var childRouter = router.currentState().value;
            childRouter.dispose();
          },
          enter: function () {
            var childRouter = router.createChildRouter('decision','home');
            router.currentState().value = childRouter;
          }
      },
      'financialplan': {value:'financialplan'},
      'budget': {value:'budget'}
    });

    function MainViewModel() {
      var self = this;
      self.router = router;
      // Media queries for repsonsive layouts
      var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      var mdQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      self.mdScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);  
      
      self.dynamicConfig = ko.pureComputed(function () {                  
        return router.moduleConfig;
      });
    };

    oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
    oj.Router.sync().then(
      function() {
        ko.applyBindings(new MainViewModel(), document.getElementById('globalBody'));
        $('#globalBody').show();
      },
      function (error) {
        oj.Logger.error('Error in root start: ' + error.message);
    });
});