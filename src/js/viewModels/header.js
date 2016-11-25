'use strict';

define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/service/dataService','ojs/ojknockout', 'ojs/ojmodule', 'ojs/ojmenu'],
    function(oj, ko, $, service)
    {   

        function HeaderViewModel() {
            // Media queries for repsonsive layouts
            self.appName = ko.observable("Money Avatar");

            // Menu Controls
            self.launch = function( model, event ) {
                var menuId = "#myMenu"+model.id;
                $(menuId).ojMenu("open", event); 
            };

            self.menuOpen = function( event ) {
                var myLauncher = $("#myLauncher");
                var currentLauncher = $(event.target).ojMenu("getCurrentOpenOptions").launcher;

                // This "which launcher?" check is relevant when a menu is shared among several launchers. 
                // It is not needed in this demo, in which only one launcher can open the menu.
                if ( myLauncher.is(currentLauncher) ) {
                  myLauncher.addClass("bold");
                }
            };

            self.menuClose = function( event ) {
                $("#myLauncher").removeClass("bold");
            };

            self.menuItemSelect = function( event, ui ) {
                self.selectedMenuItem(ui.item.children("a").text());
            };

            self.menulist = ko.observableArray([]);

            // Retrieve Menu Data
            service.fetch('js/data/menus.json',{}).then(function(response) {
                self.menulist(response['main-menus']);
            });         
        };  
        return HeaderViewModel;     
    }
);