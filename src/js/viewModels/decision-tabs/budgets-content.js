'use strict';
define(['ojs/ojcore', 'knockout'],
    function(oj, ko)
    {   
    	function BudgetsContentViewModel($params) {
            self.budgetsdata = $params;
        }

        return BudgetsContentViewModel;  	
    }
);