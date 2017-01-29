'use strict';

define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/service/dataservice','viewModels/convertors/number',
    'viewModels/service/chartservice','viewModels/service/sortservice', 'viewModels/service/financialservice',
    'ojs/ojknockout','ojs/ojmodule', 'ojs/ojbutton', 'ojs/ojcollapsible', 'ojs/ojchart','ojs/ojpopup', 'promise',
    'ojs/ojselectcombobox','ojs/ojtable', 'ojs/ojrowexpander', 'ojs/ojflattenedtreedatagriddatasource', 'ojs/ojjsontreedatasource',
    'ojs/ojpopup'],
function(oj, ko, $, dataservice, numberconvertor, chartservice, sortservice, financialservice) {   

    var header = {};

    var planview_url = 'js/data/financial/planview.json';
    var chart1 = 'js/data/home/chart/chart5.json';
    var balance_url = 'js/data/financial/accountbalance.json';
    var budget_url = 'js/data/financial/budget.json';
    var wishlist_url = 'js/data/financial/wishlist.json';

	function FinancialViewModel() {
        self.displaymenu(true);
        
        self.displaydesireslist = ko.observable(true);
        self.displaywishlist = ko.observable(false);
        self.displaydactionlist = ko.observable(false);
        self.finanacialPlanBtnValue = ko.observable('desirebtn');
        self.finanacialPlanBtnColor = ko.observable('financial-plan-btn-default');

        self.financialPlanBtn = [
            {id: 'desirebtn', label: 'Desires'},
            {id: 'wishesbtn', label: 'Wishes'},
            {id: 'actionsbtn', label: 'Actions'},
        ];

	    self.finanacialPlanBtnfn = function(event, ui){
            self.displaydesireslist(false);
            self.displaywishlist(false);
            self.displaydactionlist(false); 

            $('#desirebtn').css('financial-plan-btn-default');
            $('#wishesbtn').css('financial-plan-btn-default');
            $('#actionsbtn').css('financial-plan-btn-default');

            if(ui.option === "checked") {
               if(self.finanacialPlanBtnValue._latestValue === 'wishesbtn') {
                    $('#wishesbtn').toggleClass('financial-plan-btn-select');
                    self.displaywishlist(true);
                } else if(self.finanacialPlanBtnValue._latestValue === 'actionsbtn') {
                    $('#actionsbtn').toggleClass('financial-plan-btn-select');
                    self.displaydactionlist(true);
                } else {
                    $('#desirebtn').toggleClass('financial-plan-btn-select');
                    self.displaydesireslist(true);
                } 
            } else {
                $('#desirebtn').toggleClass('financial-plan-btn-select');
                self.displaydesireslist(true);
            }
		}

        // Start - ViewOptions 
        self.desireViewList = ko.observableArray([
          {value: 'ascpriority', label: 'Ascending Priority'},
          {value: 'descpriority', label: 'Descending Priority'},
          {value: 'asctimeline', label: 'Ascending Timeline'},
          {value: 'desctimeline', label: 'Descending Timeline'},
          {value: 'ascprobability', label: 'Ascending Probability'}
        ]);
        //End

        // Start - Impacts Desires
        self.planviews = ko.observableArray([]);
        var planViewNames = [];

        // first time on page load
        var desireslist = [];
        var selecteddesireId = '';

        self.impactdesires=ko.observableArray([]);
        dataservice.fetch(planview_url,header).then(function(response) {
            desireslist = response.sort(sortservice.priorityDesc);
            self.impactdesires(desireslist);

            selecteddesireId = desireslist[0].id;
            var planviewlist = financialservice.computePlanView(desireslist,selecteddesireId, planViewNames);
            self.planviews(planviewlist);
        });

        self.wishlist=ko.observableArray([]);
        dataservice.fetch(wishlist_url,header).then(function(response) {
            self.wishlist(response);
        });

        self.launchImpactDesires = function(event,data){
            if(data && data.value) {
                var result = [];
                switch(data.value[0]) {
                    case "ascpriority":
                        result = self.impactdesires._latestValue.sort(sortservice.priorityAsc); 
                        break;
                    case "descpriority":
                        result = self.impactdesires._latestValue.sort(sortservice.priorityDesc);
                        break;
                    case "asctimeline":
                        result = self.impactdesires._latestValue.sort(sortservice.timelineAsc);
                        break;
                    case "desctimeline":
                        result = self.impactdesires._latestValue.sort(sortservice.timelineDesc);
                        break;
                    case "ascprobability":
                        result = self.impactdesires._latestValue.sort(sortservice.probabilityAsc);
                        break;
                    default:
                        result = self.impactdesires._latestValue.sort(sortservice.priorityDesc);
                        break;
                } 
                self.impactdesires(result);
            }                
        }
        // End - Impacts Desires

        // Start - Chart Data Display Contsent
        self.seriesValues = ko.observableArray();
        self.groupValues = ko.observableArray();
        chartservice.fetchChartData(dataservice, chart1, header);

        self.yAxisConverter = ko.observable(numberconvertor.currencyConverter());
        // End - Chart Display Contents

        self.dataCursorPositionValue = ko.observable(null);
        self.GetPlanViewName = {
            format: function(value) {
                return planViewNames[value];
            }
        };

        self.optionChangeHandler = function(event, data){   
            desireslist = self.impactdesires._latestValue;       
            selecteddesireId = event.target.id;
            var planviewlist = financialservice.computePlanView(desireslist,selecteddesireId, planViewNames);
            self.planviews(planviewlist);
        }

        // Start - Account balance 
        self.accountbalance = ko.observable();
        self.balanceColumn = ko.observableArray([]);
        dataservice.fetch(balance_url,header).then(function(response) {
            var accountlist = [];
            var accounts = [];
            var balcolumns = [];
            var options = [];
            if(response && response.length > 0) {
                var b = [];  
                balcolumns.push({'headerText': '', 'headerStyle': 'display:none'});              
                for(var i =0; i < response.length; i++) {
                    var account = response[i];
                    var cnt = 0;
                    if(account.balance) {
                        account.balance.forEach(function(data) {
                            b[cnt] = (b[cnt]) ? b[cnt] + data : data;
                            cnt++;
                        });
                    }
                    balcolumns.push({'headerText': '', 'headerStyle': 'display:none'}); 
                    accounts.push({'attr':account});
                }
                accountlist.unshift({'attr':{'id':"acctbal",'type':"Account Balances",'balance' : b}, 'children': accounts});                
            }

            self.balanceColumn(balcolumns);
            self.accountbalance(new oj.FlattenedTreeTableDataSource(
                    new oj.FlattenedTreeDataSource(
                        new oj.JsonTreeDataSource(accountlist), options)));
        });
        // End - Account balance

         // Start - Budget 
        self.budgets = ko.observable();
        self.budgetColumn = ko.observableArray([]);
        dataservice.fetch(budget_url,header).then(function(response) {
            var budgetlist = [];
            var budget = [];
            var budgetcolumns = [];
            var options = [];
            if(response && response.length > 0) {
                budgetcolumns.push({'headerText': '', 'headerStyle': 'display:none'});              
                for(var i =0; i < response.length; i++) {
                    budgetcolumns.push({'headerText': '', 'headerStyle': 'display:none'}); 
                    budget.push({'attr':response[i]});
                }
                budgetlist.unshift({'attr':{'id':"budget",'type':"Budget"}, 'children': budget});                
            }

            self.budgetColumn(budgetcolumns);
            self.budgets(new oj.FlattenedTreeTableDataSource(
                    new oj.FlattenedTreeDataSource(
                        new oj.JsonTreeDataSource(budgetlist), options)));
        });
        // End - Budget

        // Model window
        self.addDesire =function() {
            $('#popup2').ojPopup('open', '#btnfinancial');
        };

        // Converters
        self.currencyformater = function(data){
            return numberconvertor.currencyformater(data);
        };

        //Start - popup
        self.displayPlanVersion = function(){
            $('#financialpopup').ojPopup('open', '#btnhref');
        }
        //End - popup

        self.probabilityColor = function(d){
            return financialservice.computeProbabilityColor(d);
        }
	}

    return FinancialViewModel;
});
