'use strict';
define(['ojs/ojcore', 'knockout'],
    function(oj, ko)
    {   
    	function ActivitiesContentViewModel($params) {
            self.activitiesdata = $params;
        }

        return ActivitiesContentViewModel;  	
    }
);