'use strict';
define(['ojs/ojcore', 'knockout', 'viewModels/service/dataservice', 'viewModels/convertors/date', 'viewModels/convertors/number', 
    'ojs/ojknockout','ojs/ojmodule','ojs/ojlistview', 'ojs/ojbutton','ojs/ojarraytabledatasource', 'ojs/ojchart', 'ojs/ojInputText',
    'ojs/ojdatetimepicker','ojs/ojselectcombobox', 'ojs/ojdialog'],
    function(oj, ko, service, dateconvertor, numberconvertor)
    {   
    	function HomeViewModel() {
            // Start - Pending Decisions & Actions Display Content
    		  //self.pendingdecisionlist = ko.observableArray([]);    		
            self.pendingdecisions = ko.observable();
           	var header = {
    			"Access-Control-Allow-Origin": "*",
  				"Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
  				"Access-Control-Allow-Methods":"GET, PUT, POST"
    		};
    		  // Retrieve Pending Decision
            service.fetch('js/data/home/decisions.json',header).then(function(response) {
                //self.pendingdecisionlist(response);
                self.pendingdecisions(new oj.ArrayTableDataSource(response['decisions']));
            }); 
            // End - Pending Decisions & Actions Display Content

            // Start - Activity Display Content
                //self.activitylist = ko.observableArray([]);
            self.activities=ko.observable();
                // Retrieve Activities
            service.fetch('js/data/home/activities.json',header).then(function(response) {
                //self.activitylist(response);
                self.activities(new oj.ArrayTableDataSource(response['activities']));
            });
            // End - Activity Display Content

            // Start - Dream/Wish List Display Content
            self.wishlist=ko.observable();
            service.fetch('js/data/home/wishlist.json',header).then(function(response) {
                self.wishlist(new oj.ArrayTableDataSource(response['wishes']));
            });
            // End - Dream/Wish List Display Content

            // Start - Calendar Display Content
            self.calendarlist=ko.observableArray([]);
            service.fetch('http://54.158.170.219/RESTEasy/rest/service/users/1234/calendars',header).then(function(response) {
                self.calendarlist(response);
            });
            // End - Calendar Display Content

            // Start - My Money Display Content
            self.moneylist=ko.observable();
            service.fetch('js/data/home/mymoney.json',header).then(function(response) {
                self.moneylist(new oj.ArrayTableDataSource(response["money"]));
            });
            // End - My Money Display Content

            // Start - Portfolio Display Content
            self.portfolio=ko.observable();
            service.fetch('js/data/home/portfolio.json',header).then(function(response) {
                self.portfolio(new oj.ArrayTableDataSource(response["portfolio"]));
            });
            // End - Portfolio Display Content

            // Start - Activity Display Content
            self.activitylist=ko.observable();
            service.fetch('js/data/home/money_activity.json',header).then(function(response) {
                self.activitylist(new oj.ArrayTableDataSource(response["moneyactivity"]));
            });
            // End - Activity Display Content

            //Start of Time view
            self.timeviews = ko.observableArray([]);
            service.fetch('js/data/home/chart/chart_timeview.json',header).then(function(response){
                self.timeviews(response["timeview"]);
            });
            self.selecttimeview = ko.observableArray([]);

            self.launchTimeView = function(event, data) {
                if(data && data.value) {
                    switch(data.value[0]) {
                        case 5:
                            fetchChartData(service, 'js/data/home/chart/chart5.json', header);
                            break;
                        case 10:
                            fetchChartData(service, 'js/data/home/chart/chart10.json', header);
                            break;
                        case 15:
                            fetchChartData(service, 'js/data/home/chart/chart15.json', header);
                            break;
                        case 20:
                            fetchChartData(service, 'js/data/home/chart/chart20.json', header);
                            break;
                        default:
                            fetchChartData(service, 'js/data/home/chart/chart1.json', header);
                            break;
                    }                    
                }                
            }
            //End of Time view

            // Start - Chart Data Display Contsent
            self.seriesValues = ko.observableArray();
            self.groupValues = ko.observableArray();
            fetchChartData(service, 'js/data/home/chart/chart1.json', header);

            self.yAxisConverter = ko.observable(numberconvertor.currencyConvertorformat());
            // End - Chart Display Contents

            // Converters
            self.formatAmount = function(data){
                return numberconvertor.formatAmount(data);
            };

            self.formatDate = function(data){
                return dateconvertor.formatToMMDDYYYY(data);
            };

            self.onEnterLoadDecision = function (data) {
                //history.pushState(null, '', '?root=decision&id='+data.userid); 
                oj.Router.rootInstance.go('decision/'+data.userid);
               // oj.Router.sync();
            };
        }

        function fetchChartData(service, chartlink, header){
            service.fetch(chartlink,header).then(function(response) {
                var grp = response['group'];
                self.groupValues(grp);
                var data = [    
                                { name:'Total Asset Value', items: response['total_asset'] },
                                { name:'Desired Value', items: response['desired'] },
                                { name:'Liquid Value', items: response['liquid'] }
                            ];
                self.seriesValues(data);
            });
        }

        return HomeViewModel;  	
    }
);