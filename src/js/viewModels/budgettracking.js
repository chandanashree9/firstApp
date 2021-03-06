'use strict';
define(['ojs/ojcore', 'knockout','jquery', 'viewModels/service/dataservice','viewModels/convertors/number', 
    'viewModels/service/budgetservice', 'ojs/ojknockout','ojs/ojmodule','ojs/ojpopup','ojs/ojlistview', 'promise', 
    'ojs/ojtable','ojs/ojarraytabledatasource', 'ojs/ojbutton','ojs/ojcollapsible','ojs/ojselectcombobox',
    'ojs/ojgauge','ojs/ojselectcombobox','ojs/ojbutton', 'ojs/ojpopup','ojs/ojinputtext'],
function(oj, ko, $, dataservice, numberconvertor, budgetservice)
{ 
     var header = {};

	var bank_url = 'js/data/budget/bankaccounts.json';
	var creditcard_url = 'js/data/budget/creditcards.json';
    var budgettracking_url = 'js/data/budget/budgettracking.json';
    var budget_entires = 'js/data/budget/budgetentries.json';

	function BudgetViewModel() {
        self.displaymenu(true);
		// Model window
        self.addbudget=function() {
            $('#popup2').ojPopup('open', '#btnfinancial');
        };

        // Start - Bank Account
        self.bankaccounts=ko.observable();
        dataservice.fetch(bank_url,header).then(function(response) {
            self.bankaccounts(new oj.ArrayTableDataSource(response));
        });
        // End - Bank Account

        //start - BudgetTracking
        self.budgettracking=ko.observable();
        dataservice.fetch(budgettracking_url,header).then(function(response) {
            self.budgettracking(new oj.ArrayTableDataSource(response));
        });
        //End - Budget Tracking

        self.budgettracking = ko.observable(new oj.ArrayTableDataSource([]));

        self.handleDropRows = function(event, ui) {
            var dragData = event.dataTransfer.getData('application/ojtablerows+json');

            if (dragData) {
                var dataArray = JSON.parse(dragData);

                for (var i = 0; i < dataArray.length; i++) {
                    self.budgettracking._latestValue.add(dataArray[i].data);
                }
            }
        };

        self.isNative = ko.observable(true);
        self.val = ko.observableArray(["EN"]);

        // Start - ViewOptions 
        self.financialPlanversion = ko.observableArray([
          {value: 'activeplan', label: 'Active Plan'},
          {value: 'buyacorvette', label: 'Buy a Corvette'},
          {value: 'beachhouse', label: 'Buy a Beach house'}
        ]);
        //End - ViewOptions

        //Start - popup Budgetentries
        self.btnClick = function(){
            $('#popup1').ojpopup('open', '#btnadd');
        };
        //End - popup Budgetentyries
        
        // Start - CreditCard Accounts
        self.creditcard=ko.observable();
        dataservice.fetch(creditcard_url,header).then(function(response) {
            self.creditcard(new oj.ArrayTableDataSource(response));
        });
        // End - CreditCard Accounts

        // Start - Budget Entries
        self.budgetentries=ko.observable();
        dataservice.fetch(budget_entires,header).then(function(response) {
            self.budgetentries(new oj.ArrayTableDataSource(response));

        });
        // End - Budget Entries

        self.entertainmentTotalFn = function(context){
             budgetservice.computeEntertainmentTotal(context);
        }

        self.currencyFormatter = function(d){
            return numberconvertor.currencyformater(d);
        }

        // Calculate Entertainment
        var computeTotal = budgetservice.computeBudgetTotal(300,250);
        self.entertainmentAmount = ko.observable(computeTotal.diff);
        self.entertainmentPercent = ko.observable(computeTotal.percentage);

        // Calculate Groceries
        computeTotal = budgetservice.computeBudgetTotal(1000,600);
        self.groceriesAmount = computeTotal.diff;
        self.groceriesPercent = ko.observable(computeTotal.percentage);

        // Calculate Travel
        computeTotal = budgetservice.computeBudgetTotal(200,40);
        self.travelAmount = computeTotal.diff;
        self.travelPercent = ko.observable(computeTotal.percentage);

        // Calculate Auto
        computeTotal = budgetservice.computeBudgetTotal(400,250);
        self.autoAmount = computeTotal.diff;
        self.autoPercent = ko.observable(computeTotal.percentage);

        // Calculate School
        computeTotal = budgetservice.computeBudgetTotal(3000,1400);
        self.schoolAmount = computeTotal.diff;
        self.schoolPercent = ko.observable(computeTotal.percentage);

        self.entertainmentBankText = ko.observable();        
        self.loadBankAmount = function(data,event){
            var bankAmount = 0;
            var bankname = '';
            if(data.id) {
                var list = self.budgettracking._latestValue.data;
                for(var i=0; i<list.length;i++){
                    var obj = list[i];
                    if(obj.bank_id === data.id){
                        bankAmount += obj.amount;
                        bankname = obj.bank_description;
                    }
                }
            }
            self.entertainmentBankText(bankAmount + " ("+bankname+")");
            printEntertainmentText();
        }

        self.printEntertainmentText = function(){
            var val = self.entertainmentBankText._latestValue;
            if(val) {
               return self.entertainmentAmount._latestValue + val.data; 
            }
            return self.entertainmentAmount._latestValue ;
        }
    }

    return BudgetViewModel;  	
});

