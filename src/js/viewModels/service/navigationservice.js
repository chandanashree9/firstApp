'use strict';

define([],
function(){ 

    function GetNavMenusList(result,data){
      if(data && data.length > 0) {
        for(var i = 0; i < data.length; i++){
            var d = data[i];
            var obj = {'id':d.id,'name':d.name,'value':d.value};
            var child = [];
            if(d.hasOwnProperty("menus")) {
                GetNavMenusList(child,d.menus);
            }
            if(child.length > 0) {
                result.push({"attr": obj, 'children': child});  
            } else {
                result.push({"attr": obj});
            }
        } 
      }
    }

    return {
        navMenulist:GetNavMenusList
    };
});