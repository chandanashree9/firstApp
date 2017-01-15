'use strict';

define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/service/dataService','ojs/ojknockout', 'ojs/ojmodule', 'ojs/ojmenu'],
    function(oj, ko, $, service) {   

        function HeaderViewModel() {
            var router = oj.Router.rootInstance;
            // Media queries for repsonsive layouts
            self.appName = ko.observable("Money Avatar");

            // Menu Controls
            self.menulaunch = function( model, event ) {
                var menuId = "#menu"+model.id;
                $(menuId).ojMenu("open", event); 
            };

            self.menuOpen = function( model, event ) {
                var currentLauncher = $(event.target).ojMenu("getCurrentOpenOptions").launcher;
                if(currentLauncher)
                    currentLauncher.addClass("bold");                
            };

            self.menuClose = function( event ) {
                $("#menuLauncher").removeClass("bold");
            };

            self.menuItemSelect = function( event, ui ) {
                router.go(ui.item.children('a').attr('val'));
            };

            self.menulist = ko.observableArray([]);

            // Retrieve Menu Data
            service.fetch('js/data/menus.json',{}).then(function(response) {
                self.menulist(response);
            });  

            // Media Queries for repsonsive header and navigation
            // Create small screen media query to update nav list orientation and button menu display
            var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
            self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
          
            // Close the drawer for medium and up screen sizes
            var mdQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
            self.mdScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);
            self.mdScreen.subscribe(function() {oj.OffcanvasUtils.close(self.drawerParams);});

            self.drawerChange = function(event, data) {
            if (data.option === 'selection' && self.smScreen())
                self.toggleDrawer();
            };
            self.drawerParams = {
                displayMode: 'push',
                selector: '#navDrawer',
                content: '#pageContent'
            };
            self.toggleDrawer = function() {
                return oj.OffcanvasUtils.toggle(self.drawerParams);
            };       
        };  
        return HeaderViewModel;     
    }
);