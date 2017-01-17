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

        // Calculate Entertainment
        var computeTotal = new computeBudgetTotal(300,250);
        self.entertainmentAmount = ko.observable(computeTotal.diff);
        self.entertainmentPercent = ko.observable(computeTotal.percentage);

        // Calculate Groceries
        computeTotal = new computeBudgetTotal(1000,600);
        self.groceriesAmount = computeTotal.diff;
        self.groceriesPercent = ko.observable(computeTotal.percentage);

        // Calculate Travel
        computeTotal = new computeBudgetTotal(200,40);
        self.travelAmount = computeTotal.diff;
        self.travelPercent = ko.observable(computeTotal.percentage);

        // Calculate Auto
        computeTotal = new computeBudgetTotal(400,250);
        self.autoAmount = computeTotal.diff;
        self.autoPercent = ko.observable(computeTotal.percentage);

        // Calculate School
        computeTotal = new computeBudgetTotal(3000,1400);
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

    function computeBudgetTotal(allocation,spent){
        var diff = (allocation - spent);
        var val = diff/allocation;
        var percentage = 0;
        if(val < 1){
            percentage = (1 - val) * 100;
        } else {
            percentage = 100;
        }

        return {
            diff:diff,
            percentage:percentage
        }
    }

    return BudgetViewModel;  	
});

