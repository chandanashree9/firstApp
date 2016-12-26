'use strict';

define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/service/dataservice','viewModels/convertors/number',
    'ojs/ojknockout','ojs/ojmodule', 'ojs/ojbutton', 'ojs/ojcollapsible', 'ojs/ojchart','ojs/ojpopup'],
function(oj, ko, $, service, numberconvertor) {   

    var header = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
        "Access-Control-Allow-Methods":"GET, PUT, POST"
    };
    var impactdesires_url = 'js/data/decision/impactdesires.json';
    var planview_url = 'js/data/financial/planview.json';
    var chart1 = 'js/data/home/chart/chart1.json';

	function FinancialViewModel() {
	    self.buttonClick = function(data, event){
        	console.log(event.currentTarget.id);
        	return true;
		}

        // Start - Impacts Desires
        self.impactdesires=ko.observableArray([]);
        service.fetch(impactdesires_url,header).then(function(response) {
            self.impactdesires(response["desires"]);
        });
        // End - Impacts Desires

        // Start - Chart Data Display Contsent
        self.seriesValues = ko.observableArray();
        self.groupValues = ko.observableArray();
        fetchChartData(service, chart1, header);

        self.yAxisConverter = ko.observable(numberconvertor.currencyConverter());
        // End - Chart Display Contents

        self.planviews = ko.observableArray();
        var palnViewNames = [];

        self.GetPlanViewName = {
            format: function(value) {
                return palnViewNames[value];
            }
        };

        self.optionChangeHandler = function(event, data){
            console.log(event.target.id);
            service.fetch(planview_url,header).then(function(response) {
                var desireslist = response["desires"];
                var planviewlist = [];
                for(var i = 0; i < desireslist.length; i++){
                    var desires = desireslist[i];
                    palnViewNames[i] = desires.description;
                    planviewlist.push({items:[{y:i, x: desires.start}],name:desires.description, color:desires.color});
                }
                self.planviews(planviewlist);
            });
        }

        // Model window
        self.addDesire =function() {
            $('#popup2').ojPopup('open', '#btnfinancial');
        };

        // Converters
        self.formatAmount = function(data){
            return numberconvertor.formatAmount(data);
        };
	}

    function fetchChartData(service, chartlink, header){
        service.fetch(chartlink,{}).then(function(response) {
            var grp = response['group'];
            self.groupValues(grp);
            var data = [    
                { name:'Total Asset Value', items: response['total_asset'] },
                { name:'Desired Value', items: response['desired'] },
                { name:'Liquid Value', items: response['liquid'] }
            ];
            self.seriesValues(data);
        });
    }

    return FinancialViewModel;
});
