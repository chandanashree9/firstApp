'use strict';
define(['ojs/ojcore', 'knockout','jquery', 'viewModels/service/dataservice','viewModels/convertors/number', 'ojs/ojknockout','ojs/ojmodule','ojs/ojpopup','ojs/ojlistview',
	'promise', 'ojs/ojtable','ojs/ojarraytabledatasource','ojs/ojbutton','ojs/ojcollapsible'],
function(oj, ko, $, service, numberconvertor)
{ 
     var header = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
        "Access-Control-Allow-Methods":"GET, PUT, POST"
    };

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
        service.fetch(bank_url,header).then(function(response) {
            self.bankaccounts(new oj.ArrayTableDataSource(response));
        });
        // End - Bank Account

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
        // End - udget Entries

        self.entertainmentlist = ko.observable(new oj.ArrayTableDataSource([]));

        self.handleDropRows = function(event, ui) {
            var dragData = event.dataTransfer.getData('application/ojtablerows+json');

            if (dragData) {
                var dataArray = JSON.parse(dragData);
                console.log(dataArray);

                for (var i = 0; i < dataArray.length; i++) {
                    self.entertainmentlist._latestValue.add(dataArray[i].data);
                }
            }
        };

        self.handleDragRows = function(event){
            
        }

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