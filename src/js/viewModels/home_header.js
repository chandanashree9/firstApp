'use strict';
define(['ojs/ojcore', 'knockout', 'ojs/ojknockout','ojs/ojmodule','ojs/ojInputText','ojs/ojdatetimepicker'],
    function(oj, ko)
    {   
    	function HomeHeaderViewModel() {
    		self.displaymenu(true);
        }

        return HomeHeaderViewModel;  	
    }
);