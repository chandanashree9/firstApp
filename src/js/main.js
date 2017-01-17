/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';

/**
 * Example of Require.js boostrap javascript
 */

requirejs.config({
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
require(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/service/dataService','ojs/ojknockout',
  'ojs/ojmodule','ojs/ojrouter','ojs/ojnavigationlist', 'ojs/ojjsontreedatasource','ojs/ojoffcanvas'],
  function (oj, ko, $, service) { // this callback gets executed when all required modules are loaded

    // Router Instance and Configuration
    var router = oj.Router.rootInstance;
    router.configure({
      'home': {value:'home', isDefault: true},
      'decision': {value:'decision'},
      'financialplan': {value:'financialplan'},
      'budget': {value:'budget'},
      'budgettracking': { value:'budgettracking' },
      'logout': { value:'logout' }
    });

    function MainViewModel() {      
      self.router = router;
            
      self.dynamicConfig = ko.pureComputed(function () {                  
        return router.moduleConfig;
      });

      // Media Queries for repsonsive header and navigation
      // Create small screen media query to update nav list orientation and button menu display
      var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
    
      // Close the drawer for medium and up screen sizes
      var mdQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      self.mdScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      // Navigation Menu display
      self.menulist = ko.observableArray([]);
      self.menuNavlist = ko.observable();

      // Retrieve Menu Data
      service.fetch('js/data/menus.json',{}).then(function(response) {
          self.menulist(response);
          if(response && response.length > 0){
              var list = [];                    
              for(var i=0; i< response.length;i++){
                  var child = [];
                  var d = response[i];
                  var obj = {'id':d.id,'name':d.name,'value':d.value};
                  getMenusList(child,d.menus);
                  list.push({"attr": obj, 'children': child});
              }
              self.menuNavlist(new oj.JsonTreeDataSource(list));
          }
      });  

      self.selectedMenuItem = ko.observable(false);
      self.loadModulePage = function( data, event ) {
        if(selectedMenuItem == true){
          router.go(data);
        }        
      };

      // Event handler for navigation list
      self.handleNavigation = function (event, ui) {
          if ('navItem' === event.target.id && event.originalEvent) {
              // router takes care of changing the selection
              event.preventDefault();

              if ($('#navDrawer').length && $('#navDrawer').hasClass('oj-offcanvas-overlay')) {
                  $('#toggleNavListButton').click();
              }
          }
      };      
      
       // Toggle Drawers [Start]
      self.offcanvasMap = {
        "toggleNavListButton": {
          "selector": "#navDrawer",
          "displayMode": "overlay",
          "modality": "modal",
          "query": oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP)
        }
      };
      self.toggleDrawer = function (model, event) {
        var drawer, launcherId = event.currentTarget.id;

        drawer = self.offcanvasMap[launcherId];
        drawer.launcherId = launcherId;

        if (drawer === self._activeOffcanvas) {
          return self.closeDrawer(drawer);
        }
        if (!self._activeOffcanvas) {
          return self.openDrawer(drawer);
        }
        return self.closeDrawer(self._activeOffcanvas).then(function () {
          return self.openDrawer(drawer);
        });
      };

      self.openDrawer = function (drawer) {
        self._activeOffcanvas = drawer;
        return oj.OffcanvasUtils.open(drawer);
      };

      self.closeDrawer = function (drawer) {
        return oj.OffcanvasUtils.close(drawer);
      }; 

      $("#navDrawer").on("ojclose", function () {
        self._activeOffcanvas = null;
      });

      self.toggleDrawerStyles = function (query) {
        var visible, drawer = $(self.offcanvasMap["toggleNavListButton"].selector);
        if (!query) {
          query = window.matchMedia(self.offcanvasMap["toggleNavListButton"].query);
        }
        visible = query.matches; // !isGalleryPage && query.matches;
        if (visible) {
          $("#main-content").before($("#content .navDrawer"));
          if (self.togglePinnedNavListButtonSetValue().length > 0) {
            $("#navDrawer").show();
          } else {
            $("#navDrawer").hide();
          }
        } else {
          $("#navDrawer").show();
          $("#main-content-wrapper").before($("#main-content-wrapper .navDrawer"));
        }
        drawer.toggleClass('oj-contrast-marker', !visible);
        drawer.toggleClass('oj-web-applayout-offcanvas', !visible);
        drawer.toggleClass("oj-offcanvas-start", !visible);

        // toggle light background when visible
        drawer.toggleClass("nav-drawer-light-bg", visible);
        
      };
    };

    function getMenusList(result,data){
      if(data && data.length > 0) {
        for(var i = 0; i < data.length; i++){
            var d = data[i];
            var obj = {'id':d.id,'name':d.name,'value':d.value};
            var child = [];
            if(d.hasOwnProperty("menus")) {
                getMenusList(child,d.menus);
            }
            if(child.length > 0) {
                result.push({"attr": obj, 'children': child});  
            } else {
                result.push({"attr": obj});
            }
        } 
      }
    } 

    oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
    oj.Router.sync().then(
      function() {
        ko.applyBindings(new MainViewModel(), document.getElementById('page-container'));
        $('#page-container').show();
      },
      function (error) {
        oj.Logger.error('Error in root start: ' + error.message);
    });
});