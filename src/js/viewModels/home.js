'use strict';
define(['ojs/ojcore', 'knockout', 'viewModels/service/dataservice', 'viewModels/convertors/date', 'viewModels/convertors/number',
    'viewModels/service/chartservice', 'ojs/ojknockout','ojs/ojmodule','ojs/ojlistview', 'ojs/ojbutton','ojs/ojarraytabledatasource', 
    'ojs/ojchart', 'ojs/ojinputtext', 'ojs/ojdatetimepicker','ojs/ojselectcombobox', 'ojs/ojdialog'],
    function(oj, ko, dataservice, dateconvertor, numberconvertor, chartservice) {   
        var header = {};

        var decision_url = 'js/data/home/decisions.json';
        var activities_url = 'js/data/home/activities.json';
        var wishlist_url = 'js/data/home/wishlist.json';
        var calendar_url = 'js/data/home/calendar.json';
        var mymoney_url = 'js/data/home/mymoney.json';
        var portfolio_url = 'js/data/home/portfolio.json';
        var money_activity_url = 'js/data/home/money_activity.json';

        var chart_timeview_url = 'js/data/home/chart/chart_timeview.json';

    	function HomeViewModel() {
            self.displaymenu(true);
            // Start - Pending Decisions & Actions Display Content		
            self.pendingdecisions = ko.observable();
            dataservice.fetch(decision_url,header).then(function(response) {
                self.pendingdecisions(new oj.ArrayTableDataSource(response['decisions']));
            }); 
            // End - Pending Decisions & Actions Display Content

            // Start - Activity Display Content
            self.activities=ko.observable();
            dataservice.fetch(activities_url,header).then(function(response) {
                self.activities(new oj.ArrayTableDataSource(response['activities']));
            });
            // End - Activity Display Content

            // Start - Dream/Wish List Display Content
            self.wishlist=ko.observable();
            dataservice.fetch(wishlist_url,header).then(function(response) {
                self.wishlist(new oj.ArrayTableDataSource(response['wishes']));
            });
            // End - Dream/Wish List Display Content

            // Start - Calendar Display Content
            self.calendarlist=ko.observable();
            dataservice.fetch(calendar_url,header).then(function(response) {
                self.calendarlist(new oj.ArrayTableDataSource(response['calendar']));
            });

            self.formatToLongDateTime = function(data){
                return dateconvertor.formatToLongDateTime(data);
            }
            // End - Calendar Display Content

            // Start - My Money Display Content
            self.moneylist=ko.observable();
            dataservice.fetch(mymoney_url,header).then(function(response) {
                self.moneylist(new oj.ArrayTableDataSource(response["money"]));
            });
            // End - My Money Display Content

            // Start - Portfolio Display Content
            self.portfolio=ko.observable();
            dataservice.fetch(portfolio_url,header).then(function(response) {
                self.portfolio(new oj.ArrayTableDataSource(response["portfolio"]));
            });
            // End - Portfolio Display Content

            // Start - Activity Display Content
            self.activitylist=ko.observable();
            dataservice.fetch(money_activity_url,header).then(function(response) {
                self.activitylist(new oj.ArrayTableDataSource(response["moneyactivity"]));
            });
            // End - Activity Display Content

            //Start of Time view
            self.timeviews = ko.observableArray([]);
            dataservice.fetch(chart_timeview_url,header).then(function(response){
                self.timeviews(response["timeview"]);
            });
            self.selecttimeview = ko.observableArray([]);

            self.launchTimeView = function(event, data) {
                chartservice.launchTimeViewChart(data);
            }
            //End of Time view

            // Start - Chart Data Display Contsent
            self.seriesValues = ko.observableArray();
            self.groupValues = ko.observableArray();
            chartservice.fetchChartData(dataservice, '', header);

            self.xAxisConverter = ko.observable(dateconvertor.converterMMMYY());
            self.yAxisConverter = ko.observable(numberconvertor.currencyConverter());
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

        return HomeViewModel;  	
    }
);