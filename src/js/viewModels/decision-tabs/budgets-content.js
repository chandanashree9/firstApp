'use strict';
define(['ojs/ojcore', 'knockout','viewModels/convertors/number', 'viewModels/convertors/date'],
    function(oj, ko, numberconvertor,dateconvertor)
    {   
    	function BudgetsContentViewModel($params) {
            self.budgetsObj = $params;
            self.budgetlist=ko.observable(new oj.ArrayTableDataSource(budgetsObj.data));
            self.getBudgetActivities = function(data){
            	return new oj.ArrayTableDataSource(data.activities);
            }

            self.formatNumberToCurrency = function(data){
                return numberconvertor.currencyformater(data);
            }

            self.formatDateToMMDDYYY = function(data){
                return dateconvertor.formatToMMDDYYYY(data);
            }
        }

        return BudgetsContentViewModel;  	
    }
);