'use strict';

define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/service/dataService','ojs/ojknockout', 'ojs/ojmodule', 'ojs/ojmenu'],
    function(oj, ko, $, service)
    {   

        function HeaderViewModel() {
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
                //self.selectedMenuItem(ui.item.children("a").text());
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