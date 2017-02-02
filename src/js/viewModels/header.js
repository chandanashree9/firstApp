'use strict';

define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 
    'ojs/ojmodule', 'ojs/ojmenu','ojs/ojoffcanvas'],
    function(oj, ko, $) {   

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
                if(currentLauncher) {
                    currentLauncher.addClass("bold");                
                }
            };

            self.menuClose = function( event, model) {
                $("#menuLauncher").removeClass("bold");
            };

            self.menuClickEvent = function( model, event ) {
                if(model.hasOwnProperty("value")) {
                    router.go(model.value);
                }
            };

            self.menuItemSelect = function( event, ui ) {
                router.go(ui.item.children('a').attr('val'));
            };

            self.displaymenu = ko.observable(true);
        }; 
        
        return HeaderViewModel;     
    }
);