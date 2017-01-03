'use strict';

define([],
function(){
	
	function priorityDesc(obj1, obj2) {
        if (obj2.desire_priority < obj1.desire_priority) {
           return -1;
        }else if (obj2.desire_priority > obj1.desire_priority) {
            return 1;
        }        
        return 0;
	}
	
	function priorityAsc(obj1,obj2){
		if(obj1.desire_priority < obj2.desire_priority){
			return -1;
		}else if (obj1.desire_priority > obj2.desire_priority) {
			return 1;
		}
		return 0;
	}

	function timelineAsc(obj1,obj2){
		var d = new Date().getTime();
        if(obj1.expense_Date) {
            d = new Date(obj1.expense_Date).getTime();
        }
        var d1 = new Date().getTime();
        if(obj2.expense_Date) {
            d1 = new Date(obj2.expense_Date).getTime();
        }
        if(d < d1){
        	return -1;
        }else if (d > d1){
        	return 1;
        }
        return 0;
    }
    
    function timelineDesc(obj1,obj2){
    	var d = new Date().getTime();
        if(obj1.expense_Date) {
            d = new Date(obj1.expense_Date).getTime();
        }
        var d1 = new Date().getTime();
        if(obj2.expense_Date) {
            d1 = new Date(obj2.expense_Date).getTime();
        }
        if(d1 < d){
        	return -1;
        }else if (d1 > d){
        	return 1;
        }
        return 0;
    } 

    function probabilityAsc(obj1,obj2){
        if(obj1.probability < obj2.probability){
            return -1;
        }else if (obj1.probability > obj2.probability) {
            return 1;
        }
        return 0;
    }
    
	return {
		priorityDesc : priorityDesc,
		priorityAsc : priorityAsc,
		timelineAsc : timelineAsc,
    	timelineDesc : timelineDesc,
        probabilityAsc : probabilityAsc
    };
});