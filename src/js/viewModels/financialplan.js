'use strict';

define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/service/dataservice','viewModels/convertors/number', 
    'viewModels/service/financialService','ojs/ojknockout','ojs/ojmodule', 'ojs/ojbutton', 'ojs/ojcollapsible', 'ojs/ojchart','ojs/ojpopup',
    'promise','ojs/ojselectcombobox'],
function(oj, ko, $, service, numberconvertor, financialservice) {   

    var header = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
        "Access-Control-Allow-Methods":"GET, PUT, POST"
    };
    var planview_url = 'js/data/financial/planview.json';
    var chart1 = 'js/data/home/chart/chart5.json';
    var balance_url = 'js/data/financial/accountbalance.json';

	function FinancialViewModel() {
	    self.buttonClick = function(data, event){
        	console.log(event.currentTarget.id);
        	return true;
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
            desireslist = response.sort(prioritySort);
            self.impactdesires(desireslist);

            selecteddesireId = desireslist[0].id;
            var planviewlist = computePlanView(desireslist,selecteddesireId, planViewNames);
            self.planviews(planviewlist);
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

        self.accountbalance = ko.observable();
        self.accounts = ko.observableArray();
        service.fetch(balance_url,header).then(function(response) {
            var accountlist = response;
            var acctbal = {};
            if(accountlist && accountlist.length > 0) {
                var b = [];                
                for(var i =0; i < accountlist.length; i++) {
                    var account = accountlist[i];
                    var cnt = 0;
                    if(account.balance) {
                        account.balance.forEach(function(data) {
                            b[cnt] = (b[cnt]) ? b[cnt] + data : data;
                            cnt++;
                        });
                    }
                }
                acctbal = {"type":"Account Balances","balance" : b };
            }
            self.accountbalance(acctbal);
            self.accounts(response);
        });

        // Model window
        self.addDesire =function() {
            $('#popup2').ojPopup('open', '#btnfinancial');
        };

        // Converters
        self.formatAmount = function(data){
            return numberconvertor.formatAmount(data);
        };
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

    function prioritySort(obj1, obj2) {
        if (obj2.desire_priority < obj1.desire_priority) {
           return -1;
        }else if (obj2.desire_priority > obj1.desire_priority) {
            return 1;
        }        
        return 0;
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

    return FinancialViewModel;
});
