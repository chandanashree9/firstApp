'use strict';
define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/service/dataservice',
    'viewModels/convertors/number','viewModels/convertors/date', 'viewModels/service/financialService',
    'ojs/ojknockout', 'ojs/ojchart'],
function(oj, ko, $, service, numberconvertor,dateconvertor, financialservice)
{
    var header = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
        "Access-Control-Allow-Methods":"GET, PUT, POST"
    };
    
    var wishlist_url = 'js/data/financial/wishlist.json';
    var planview_url = 'js/data/financial/planview.json';

    function DesireViewModel() {
        
        self.planviews = ko.observableArray([]);
        var planViewNames = [];

        // Start - Impacts Desires
        self.impactdesires=ko.observableArray([]);
        service.fetch(planview_url,header).then(function(response) {
            response = response.sort(financialservice.targetDateAsc);
            self.impactdesires(response);
            var planviewlist = computePlanView(response, planViewNames);
            self.planviews(planviewlist);
        });
        // End - Impacts Desires

        // Start - wishlist
        self.wishlist=ko.observableArray([]);
        service.fetch(wishlist_url,header).then(function(response) {
            self.wishlist(response);
        });
        // End - wishlist

         // Converters
        self.formatToMedium = function(data){
            return dateconvertor.formatToMedium(data);
        };

        self.currencyformater = function(data){
            return numberconvertor.currencyformater(data);
        };

        self.probabilityColor = function(d){
            return computeProbabilityColor(d);
        }

        self.selectedDesire=ko.observable();
        self.desireListDetailsfn =function(data){
            self.selectedDesire(data);
            $('#desirepopup').ojPopup('open', '#desiredetails_'+data.id);

        };

        self.GetPlanViewName = {
            format: function(value) {
                return planViewNames[value];
            }
        };
    }

    function computePlanView(desireslist, planViewNames){
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

    function computeProbabilityColor(data){
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

    return DesireViewModel;
});
