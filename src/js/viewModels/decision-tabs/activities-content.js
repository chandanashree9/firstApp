'use strict';
define(['ojs/ojcore', 'knockout'],
    function(oj, ko)
    {   
    	function ActivitiesContentViewModel($params) {
            var activityObj = $params;
            self.activitylist=ko.observable(new oj.ArrayTableDataSource(activityObj.data));
     }
     return ActivitiesContentViewModel;  	
});