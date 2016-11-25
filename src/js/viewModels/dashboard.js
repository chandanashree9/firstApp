'use strict';
define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/service/dataService','ojs/ojmodule','ojs/ojlistview', 'ojs/ojarraytabledatasource'],
    function(oj, ko, $, service)
    {   
    	function DashboardViewModel(){
    		//self.pendingdecisionlist = ko.observableArray([]);
    		//self.activitylist = ko.observableArray([]);
            self.pendingdecisions = ko.observable();
            self.activities=ko.observable();

    		var header = {
    			"Access-Control-Allow-Origin": "*",
  				"Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
  				"Access-Control-Allow-Methods":"GET, PUT, POST"
    		};
    		 // Retrieve Pending Decision
            service.fetch('http://54.158.170.219/RESTEasy/rest/service/users/1234/decisions',header).then(function(response) {
                //self.pendingdecisionlist(response);
                self.pendingdecisions(new oj.ArrayTableDataSource(response));
            }); 

            // Retrieve Activities
            service.fetch('http://54.158.170.219/RESTEasy/rest/service/users/1234/activities',header).then(function(response) {
                //self.activitylist(response);
                self.activities(new oj.ArrayTableDataSource(response));
            });
    	}
        return DashboardViewModel;  	
    }
);