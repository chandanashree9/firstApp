'use strict';
define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/service/dataService','ojs/ojknockout','ojs/ojmodule','ojs/ojlistview', 
    'ojs/ojbutton','ojs/ojarraytabledatasource', 'ojs/ojchart', 'ojs/ojgauge', 'ojs/ojselectcombobox'],
    function(oj, ko, $, service)
    {   
    	function DashboardViewModel() {
    		//self.pendingdecisionlist = ko.observableArray([]);
    		//self.activitylist = ko.observableArray([]);
            self.pendingdecisions = ko.observable();
            self.activities=ko.observable();
            self.wish=ko.observable();

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

             service.fetch('http://54.158.170.219/RESTEasy/rest/service/users/1234/wishes',header).then(function(response) {
                //self.activitylist(response);
                self.activities(new oj.ArrayTableDataSource(response));
            });

            // Chart Data Maping
            self.seriesValues = ko.observableArray();
            self.groupValues = ko.observableArray();

            // Load Chart Data
            service.fetch('js/data/chart.json',header).then(function(response) {
                var grp = response['group'];
                self.groupValues(grp);
                var data = [    
                                { name:'Total Asset Value', items: response['total_asset'] },
                                { name:'Desired Value', items: response['desired'] },
                                
                                
                                { name:'Liquid Value', items: response['liquid'] }
                                
                                
                            ];
                self.seriesValues(data);
            });

            var dateConverterFactory = oj.Validation.converterFactory('datetime');
            var option = {formatStyle: 'date', isoStrFormat: 'auto'};
            self.xAxisConverter = ko.observable(dateConverterFactory.createConverter(option));

            var numberConverterFactory = oj.Validation.converterFactory('number');
            self.yAxisConverter = ko.observable(numberConverterFactory.createConverter({style: 'currency', currency: 'USD', 
                                                decimalFormat:'short', maximumFractionDigits:0}));
        }
        return DashboardViewModel;  	
    }
);