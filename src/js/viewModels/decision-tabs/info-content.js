'use strict';
define(['ojs/ojcore', 'knockout'],
    function(oj, ko)
    {   
    	function InfoContentViewModel($params) {
            self.infodata = $params;
        }

        return InfoContentViewModel;  	
    }
);