'use strict';
define(['ojs/ojcore', 'knockout', 'viewModels/service/dataservice', 'viewModels/convertors/date', 'viewModels/convertors/number', 
    'ojs/ojknockout','ojs/ojmodule','ojs/ojlistview', 'ojs/ojbutton','ojs/ojarraytabledatasource', 'ojs/ojchart', 'ojs/ojinputtext',
    'ojs/ojdatetimepicker','ojs/ojselectcombobox', 'ojs/ojdialog'],
    function(oj, ko, service, dateconvertor, numberconvertor)
    {   
        var header = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
            "Access-Control-Allow-Methods":"GET, PUT, POST"
        };

        var decision_url = 'js/data/home/decisions.json';
        var activities_url = 'js/data/home/activities.json';
        var wishlist_url = 'js/data/home/wishlist.json';
        var calendar_url = 'js/data/home/calendar.json';
        var mymoney_url = 'js/data/home/mymoney.json';
        var portfolio_url = 'js/data/home/portfolio.json';
        var money_activity_url = 'js/data/home/money_activity.json';

        var chart_timeview_url = 'js/data/home/chart/chart_timeview.json';
        var chart1_url = 'js/data/home/chart/chart1.json';
        var chart5_url = 'js/data/home/chart/chart5.json';
        var chart10_url = 'js/data/home/chart/chart10.json';
        var chart15_url = 'js/data/home/chart/chart15.json';
        var chart20_url = 'js/data/home/chart/chart20.json';        

    	function HomeViewModel() {
            self.displaymenu(true);
            // Start - Pending Decisions & Actions Display Content		
            self.pendingdecisions = ko.observable();
            service.fetch(decision_url,header).then(function(response) {
                self.pendingdecisions(new oj.ArrayTableDataSource(response['decisions']));
            }); 
            // End - Pending Decisions & Actions Display Content

            // Start - Activity Display Content
            self.activities=ko.observable();
            service.fetch(activities_url,header).then(function(response) {
                self.activities(new oj.ArrayTableDataSource(response['activities']));
            });
            // End - Activity Display Content

            // Start - Dream/Wish List Display Content
            self.wishlist=ko.observable();
            service.fetch(wishlist_url,header).then(function(response) {
                self.wishlist(new oj.ArrayTableDataSource(response['wishes']));
            });
            // End - Dream/Wish List Display Content

            // Start - Calendar Display Content
            self.calendarlist=ko.observable();
            service.fetch(calendar_url,header).then(function(response) {
                self.calendarlist(new oj.ArrayTableDataSource(response['calendar']));
            });

            self.formatToLongDateTime = function(data){
                return dateconvertor.formatToLongDateTime(data);
            }
            // End - Calendar Display Content

            // Start - My Money Display Content
            self.moneylist=ko.observable();
            service.fetch(mymoney_url,header).then(function(response) {
                self.moneylist(new oj.ArrayTableDataSource(response["money"]));
            });
            // End - My Money Display Content

            // Start - Portfolio Display Content
            self.portfolio=ko.observable();
            service.fetch(portfolio_url,header).then(function(response) {
                self.portfolio(new oj.ArrayTableDataSource(response["portfolio"]));
            });
            // End - Portfolio Display Content

            // Start - Activity Display Content
            self.activitylist=ko.observable();
            service.fetch(money_activity_url,header).then(function(response) {
                self.activitylist(new oj.ArrayTableDataSource(response["moneyactivity"]));
            });
            // End - Activity Display Content

            //Start of Time view
            self.timeviews = ko.observableArray([]);
            service.fetch(chart_timeview_url,header).then(function(response){
                self.timeviews(response["timeview"]);
            });
            self.selecttimeview = ko.observableArray([]);

            self.launchTimeView = function(event, data) {
                if(data && data.value) {
                    switch(data.value[0]) {
                        case 5:
                            fetchChartData(service, chart5_url, header);
                            break;
                        case 10:
                            fetchChartData(service, chart10_url, header);
                            break;
                        case 15:
                            fetchChartData(service, chart15_url, header);
                            break;
                        case 20:
                            fetchChartData(service, chart20_url, header);
                            break;
                        default:
                            fetchChartData(service, chart1_url, header);
                            break;
                    }                    
                }                
            }
            //End of Time view

            // Start - Chart Data Display Contsent
            self.seriesValues = ko.observableArray();
            self.groupValues = ko.observableArray();
            fetchChartData(service, chart1_url, header);

            self.yAxisConverter = ko.observable(numberconvertor.currencyConverter());
            self.xAxisConverter = ko.observable(dateconvertor.converterMMMYY());
            // End - Chart Display Contents

            // Converters
            self.formatAmount = function(data){
                return numberconvertor.roundoffToSeconddecimal(data);
            };

            self.formatDate = function(data){
                return dateconvertor.formatToMMDDYYYY(data);
            };

            // Click event
            self.onEnterLoadDecision = function (data, event) {
                history.pushState(null, '', '?root=decision&id='+data.userid); 
                //oj.Router.rootInstance.go('decision/'+data.userid);
                oj.Router.sync();

                return true;
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