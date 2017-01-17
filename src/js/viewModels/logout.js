'use strict';
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout','ojs/ojmodule'],
    function(oj, ko, $) {   
    	function LogoutViewModel() {
   			self.displaymenu(false);
        }        
        return LogoutViewModel;  	
    }
);