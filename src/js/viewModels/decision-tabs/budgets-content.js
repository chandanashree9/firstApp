'use strict';
define(['ojs/ojcore', 'knockout'],
    function(oj, ko)
    {   
    	function BudgetsContentViewModel($params) {
            self.budgetsObj = $params;
            self.budgetlist=ko.observable(new oj.ArrayTableDataSource(budgetsObj.data));
            self.getBudgetActivities = function(data){
            	return new oj.ArrayTableDataSource(data.activities);
            }
        }

        return BudgetsContentViewModel;  	
    }
);