'use strict';
define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/service/dataservice', 'viewModels/convertors/number',
    'viewModels/convertors/date', 'viewModels/service/sortservice', 'viewModels/service/financialservice',
    'ojs/ojknockout', 'ojs/ojchart'],
function(oj, ko, $, dataservice, numberconvertor,dateconvertor, sortservice, financialservice)
{
    var header = {};
    
    var wishlist_url = 'js/data/financial/wishlist.json';
    var planview_url = 'js/data/financial/planview.json';

    function DesireViewModel() {
        
        self.planviews = ko.observableArray([]);
        var planViewNames = [];

        // Start - Impacts Desires
        self.impactdesires=ko.observableArray([]);
        dataservice.fetch(planview_url,header).then(function(response) {
            response = response.sort(sortservice.targetDateAsc);
            self.impactdesires(response);
            var planviewlist = financialservice.computeDesirePlanView(response, planViewNames);
            self.planviews(planviewlist);
        });
        // End - Impacts Desires

        // Start - wishlist
        self.wishlist=ko.observableArray([]);
        dataservice.fetch(wishlist_url,header).then(function(response) {
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
            return financialservice.computeProbabilityColor(d);
        }

        self.selectedDesireTitle=ko.observable();
        self.selectedDesireColor = ko.observable();
        self.desireListDetailsfn =function(data){
            self.selectedDesireTitle(data.title);
            self.selectedDesireColor(financialservice.computeProbabilityColor(data.probability))
            $('#desirepopup').ojPopup('open', '#desiredetails_'+data.id);

        };

        self.GetPlanViewName = {
            format: function(value) {
                return planViewNames[value];
            }
        };

        self.desireAdviceBtnfn = function(event, ui) {
            if(ui.option === "checked") {
                if($('#desire-btn-advice-selected').length > 0) {
                    $('#desire-btn-advice-selected').attr('id','desire-btn-advice');
                } else {
                    $('#desire-btn-advice').attr('id','desire-btn-advice-selected');
                }
            }
        }
        
        self.desireConversationBtnfn = function(event, ui) {
            if(ui.option === "checked") {
                if($('#desire-btn-conversations-selected').length > 0) {
                    $('#desire-btn-conversations-selected').attr('id','desire-btn-conversations');
                } else {
                    $('#desire-btn-conversations').attr('id','desire-btn-conversations-selected');
                }
            }
        }

        //Start - popup
        self.displayPlanVersion = function(){
            $('#popup-plan-version').ojPopup('open', '#pop-plan-version-link');
        }
        //End - popup
    }

    return DesireViewModel;
});
