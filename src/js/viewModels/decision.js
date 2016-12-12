'use strict';
define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/service/dataservice','viewModels/convertors/date',
    'ojs/ojknockout','ojs/ojmodule', 'ojs/ojlistview', 'ojs/ojbutton','ojs/ojarraytabledatasource', 
    'ojs/ojInputText','ojs/ojdatetimepicker','ojs/ojmodel','ojs/ojnavigationlist','ojs/ojtabs','ojs/ojconveyorbelt',
    'promise','ojs/ojgantt'],
    function(oj, ko, $, service, dateconvertor)
    {   
    	function DecisionViewModel() {
    		self.title=ko.observable();
            self.description=ko.observable();
            self.duedate=ko.observable();
            self.alternatives=ko.observable();
            var decisionObj = {};

            service.fetch('js/data/decision/decision1.json',{}).then(function(response) {
                decisionObj =response["decision"];
                self.title(decisionObj.title);
                self.description(decisionObj.description);
                self.duedate(dateconvertor.formatToMedium(decisionObj.duedate));
                self.alternatives(new oj.ArrayTableDataSource(decisionObj.alternatives));
            });

            self.projectStartDate = new Date("Jan 1, 2015").getTime();
            self.projectEndDate = new Date("Dec 31, 2020").getTime();

            self.selectedAlternatives = ko.observable(false);
            self.subscription = ko.observable(false);

            self.loadDesireImpact = function(data){
                service.fetch('js/data/decision/cancelsubscription.json',{}).then(function(response) {
                    self.subscription(response);
               });
            }

            self.getImapctChart = function(data){
                return data.impacts;
            }  
    	}
    	return DecisionViewModel;
    }
);