'use strict';
define(['ojs/ojcore', 'knockout'],
    function(oj, ko)
    {   
    	function PortfolioContentViewModel($params) {
            self.portfoliodata = $params;
        }

        return PortfolioContentViewModel;  	
    }
);