'use strict';
define(['ojs/ojcore', 'knockout','jquery', 'viewModels/service/dataservice','viewModels/convertors/number', 'ojs/ojknockout','ojs/ojmodule','ojs/ojpopup','ojs/ojlistview',
	'promise', 'ojs/ojtable','ojs/ojarraytabledatasource','ojs/ojbutton','ojs/ojcollapsible','ojs/ojselectcombobox','ojs/ojgauge',
    'ojs/ojselectcombobox','ojs/ojbutton','ojs/ojpopup','ojs/ojinputtext'],
function(oj, ko, $, service, numberconvertor)
{ 
     var header = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
        "Access-Control-Allow-Methods":"GET, PUT, POST"
    };

	var bank_url = 'js/data/budget/bankaccounts.json';
	var creditcard_url = 'js/data/budget/creditcards.json';
    var budgettracking_url = 'js/data/budget/budgettracking.json';
    var budget_entires = 'js/data/budget/budgetentries.json';

	function BudgetViewModel() {
		// Model window
        self.addbudget=function() {
            $('#popup2').ojPopup('open', '#btnfinancial');
        };

        // Start - Bank Account
        self.bankaccounts=ko.observable();
        service.fetch(bank_url,header).then(function(response) {
            self.bankaccounts(new oj.ArrayTableDataSource(response));
        });
        // End - Bank Account

        //start - BudgetTracking
        self.budgettracking=ko.observable();
        service.fetch(budgettracking_url,header).then(function(response) {
            self.budgettracking(new oj.ArrayTableDataSource(response));
        });
        //End - Budget Tracking

        self.budgettracking = ko.observable(new oj.ArrayTableDataSource([]));

        self.handleDropRows = function(event, ui) {
            var dragData = event.dataTransfer.getData('application/ojtablerows+json');

            if (dragData) {
                var dataArray = JSON.parse(dragData);
                console.log(dataArray);

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
        //start - AddBudgetEntry
        /*function addBudgetEntry(){
            $('#popup1').ojPopup('open', #btnaddBudget);
        }*/
        //End - AddBudgetEntry

        //start - addEntertainmentAmount

        //End - addEntertainmentAmount

        // Start - CreditCard Accounts
        self.creditcard=ko.observable();
        service.fetch(creditcard_url,header).then(function(response) {
            self.creditcard(new oj.ArrayTableDataSource(response));
        });
        // End - CreditCard Accounts

        // Start - Budget Entries
        self.budgetentries=ko.observable();
        service.fetch(budget_entires,header).then(function(response) {
            self.budgetentries(new oj.ArrayTableDataSource(response));

        });
        // End - Budget Entries


        self.entertainmentTotalFn = function(context){
            var datasource = context.datasource;

            if (!datasource || datasource.totalSize() <= 0) {
                return;
            }

            var total = 0;
            var totalRowCount = datasource.totalSize();

            var addAmount = function(rowNum) {
                datasource.at(rowNum).then(function(row) {
                    total = total + row['data']['amount'];
                    if (rowNum < totalRowCount - 1)
                    {
                        addAmount(rowNum + 1);
                    }
                    else
                    {
                        var parentElement = $(document.getElementById("table:entertainment_total"));
                        parentElement.empty();
                        parentElement.append(total);
                        parentElement.addClass('oj-helper-text-align-right');
                    }
                });
            };
            addAmount(0);
        }

        self.currencyFormatter = function(d){
            return numberconvertor.currencyformater(d);
        }
    }

    return BudgetViewModel;  	
});

