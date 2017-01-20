'use strict';

define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/service/dataservice','viewModels/convertors/number', 
    'viewModels/service/financialService','ojs/ojknockout','ojs/ojmodule', 'ojs/ojbutton', 'ojs/ojcollapsible', 'ojs/ojchart','ojs/ojpopup',
    'promise','ojs/ojselectcombobox','ojs/ojtable', 'ojs/ojrowexpander', 'ojs/ojflattenedtreedatagriddatasource', 'ojs/ojjsontreedatasource'],
function(oj, ko, $, service, numberconvertor, financialservice) {   

    var header = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
        "Access-Control-Allow-Methods":"GET, PUT, POST"
    };
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
        service.fetch(planview_url,header).then(function(response) {
            desireslist = response.sort(financialservice.priorityDesc);
            self.impactdesires(desireslist);

            selecteddesireId = desireslist[0].id;
            var planviewlist = computePlanView(desireslist,selecteddesireId, planViewNames);
            self.planviews(planviewlist);
        });

        self.wishlist=ko.observableArray([]);
        service.fetch(wishlist_url,header).then(function(response) {
            self.wishlist(response);
        });

        self.launchImpactDesires = function(event,data){
            if(data && data.value) {
                var result = [];
                switch(data.value[0]) {
                    case "ascpriority":
                        result = self.impactdesires._latestValue.sort(financialservice.priorityAsc); 
                        break;
                    case "descpriority":
                        result = self.impactdesires._latestValue.sort(financialservice.priorityDesc);
                        break;
                    case "asctimeline":
                        result = self.impactdesires._latestValue.sort(financialservice.timelineAsc);
                        break;
                    case "desctimeline":
                        result = self.impactdesires._latestValue.sort(financialservice.timelineDesc);
                        break;
                    case "ascprobability":
                        result = self.impactdesires._latestValue.sort(financialservice.probabilityAsc);
                        break;
                    default:
                        result = self.impactdesires._latestValue.sort(financialservice.priorityDesc);
                        break;
                } 
                self.impactdesires(result);
            }                
        }
        // End - Impacts Desires

        // Start - Chart Data Display Contsent
        self.seriesValues = ko.observableArray();
        self.groupValues = ko.observableArray();
        fetchChartData(service, chart1, header);

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
            var planviewlist = computePlanView(desireslist,selecteddesireId, planViewNames);
            self.planviews(planviewlist);
        }

        // Start - Account balance 
        self.accountbalance = ko.observable();
        self.balanceColumn = ko.observableArray([]);
        service.fetch(balance_url,header).then(function(response) {
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
        service.fetch(budget_url,header).then(function(response) {
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

        self.probabilityColor = function(d){
            return computeProbabilityColor(d);
        }
	}

    function fetchChartData(service, chartlink, header){
        service.fetch(chartlink,{}).then(function(response) {
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

    function computePlanView(desireslist, selectedDesireId, planViewNames){
        var planviewlist = [];
        var preparelist = [];       

        var selecteddesire = {};
        var list1 = [];
        var list2 = [];

        for(var i = 0; i < desireslist.length; i++){
            if(desireslist[i].id == selectedDesireId) {
                selecteddesire = desireslist[i];
                break;
            }
        }

        for(var i = 0; i < desireslist.length; i++){
            var desires = desireslist[i];  

            var d = new Date().getTime();
            if(selecteddesire.expense_Date) {
                d = new Date(selecteddesire.expense_Date).getTime();
            }
            var d1 = new Date().getTime();
            if(desires.expense_Date) {
                d1 = new Date(desires.expense_Date).getTime();
            }

            if(d < d1 ){
               list1.push(desires);
            } else if(selecteddesire.id != desires.id) {
                list2.push(desires);
            }           
        }

        list1.sort();
        list2.sort();

        if(list1.length > 3){
           list1 = list1.slice(-2); 
        }
        list1.push(selecteddesire);
        if(list2.length > 2) {
            list2 = list2.slice(0,2);
        }
        preparelist = list1.concat(list2);

        var count = 0;
        for(var i = preparelist.length -1 ; i >= 0; i--){
            var desire = preparelist[i];  
            if(desire.target_date) {
                planViewNames[count++] = desire.title;
                planviewlist.push({items:[{y:i, x:new Date(desire.target_date).getTime()}],name:desire.title});
            }                
        }
        return planviewlist;
    }

    function computeProbabilityColor(data){
        if(data >= 80 && data <= 100){
            return 'green';
        }else if(data >= 65 && data <= 79 ){
            return 'blue';
        }else if(data >= 50 && data <= 64){
            return 'orange';
        }else{
            return 'red';
        }
    }

    return FinancialViewModel;
});
