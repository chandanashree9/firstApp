'use strict';
define(['ojs/ojcore', 'knockout','jquery', 'viewModels/service/dataservice','viewModels/convertors/number', 
    'viewModels/service/budgetservice', 'ojs/ojknockout','ojs/ojmodule','ojs/ojpopup','ojs/ojlistview',
	'promise', 'ojs/ojtable','ojs/ojarraytabledatasource','ojs/ojbutton','ojs/ojcollapsible'],
function(oj, ko, $, dataservice, numberconvertor, budgetservice)
{ 
     var header = {};

	var bank_url = 'js/data/budget/bankaccounts.json';
	var creditcard_url = 'js/data/budget/creditcards.json';
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
        // End - udget Entries

        self.entertainmentlist = ko.observable(new oj.ArrayTableDataSource([]));

        self.handleDropRows = function(event, ui) {
            var dragData = event.dataTransfer.getData('application/ojtablerows+json');

            if (dragData) {
                var dataArray = JSON.parse(dragData);

                for (var i = 0; i < dataArray.length; i++) {
                    self.entertainmentlist._latestValue.add(dataArray[i].data);
                }
            }
        };

        self.handleDragRows = function(event){
            
        }

        self.entertainmentTotalFn = function(context){
            budgetservice.computeEntertainmentTotal(context);
        }

        self.currencyFormatter = function(d){
            return numberconvertor.currencyformater(d);
        }
    }

    return BudgetViewModel;  	
});