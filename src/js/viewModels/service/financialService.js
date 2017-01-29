'use strict';

define([],
function(){	

	function planView(desireslist, selectedDesireId, planViewNames){
        var planviewlist = [];
        var preparelist = [];       

        var selecteddesire = {};
        var list1 = [];
        var list2 = [];

        for(var i = 0; i < desireslist.length; i++){
            if(desireslist[i].id == selectedDesireId) {
                selecteddesire = desireslist[i];
                break;
            }
        }

        for(var i = 0; i < desireslist.length; i++){
            var desires = desireslist[i];  

            var d = new Date().getTime();
            if(selecteddesire.expense_Date) {
                d = new Date(selecteddesire.expense_Date).getTime();
            }
            var d1 = new Date().getTime();
            if(desires.expense_Date) {
                d1 = new Date(desires.expense_Date).getTime();
            }

            if(d < d1 ){
               list1.push(desires);
            } else if(selecteddesire.id != desires.id) {
                list2.push(desires);
            }           
        }

        list1.sort();
        list2.sort();

        if(list1.length > 3){
           list1 = list1.slice(-2); 
        }
        list1.push(selecteddesire);
        if(list2.length > 2) {
            list2 = list2.slice(0,2);
        }
        preparelist = list1.concat(list2);

        var count = 0;
        for(var i = preparelist.length -1 ; i >= 0; i--){
            var desire = preparelist[i];  
            if(desire.target_date) {
                planViewNames[count++] = desire.title;
                planviewlist.push({items:[{y:i, x:new Date(desire.target_date).getTime()}],name:desire.title});
            }                
        }
        return planviewlist;
    }

    function desirePlanView(desireslist, planViewNames){
        var planviewlist = [];   
        var count = 0; 
        desireslist = desireslist.reverse();
        for(var i = desireslist.length -1 ; i >= 0; i--){
            var desire = desireslist[i];  
            if(desire.target_date) {
                planViewNames[count++] = desire.title;
                planviewlist.push({items:[{y:i, x:new Date(desire.target_date).getTime()}],name:desire.title});
            }                
        }
        planViewNames = planViewNames.reverse();
        return planviewlist;
    }

    function probabilityColor(data){
        if(data >= 80 && data <= 100){
            return 'green';
        }else if(data >= 65 && data <= 79 ){
            return 'blue';
        }else if(data >= 50 && data <= 64){
            return 'orange';
        }else{
            return 'red';
        }
    }

    return{
    	computePlanView: planView,
        computeDesirePlanView: desirePlanView,
    	computeProbabilityColor: probabilityColor
    };
});