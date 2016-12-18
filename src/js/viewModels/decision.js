'use strict';
define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/service/dataservice','viewModels/convertors/date','viewModels/convertors/number',
    'ojs/ojknockout','ojs/ojmodule', 'ojs/ojlistview', 'ojs/ojbutton','ojs/ojarraytabledatasource', 
    'ojs/ojInputText','ojs/ojdatetimepicker','ojs/ojmodel','ojs/ojnavigationlist','ojs/ojtabs','ojs/ojconveyorbelt',
    'ojs/ojtable','ojs/ojtimeutils', 'ojs/ojtimeaxis'],
    function(oj, ko, $, service, dateconvertor, numberconvertor)
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

            self.selectedAlternatives = ko.observable(false);
            self.subscription = ko.observable(false);

            self.loadDesireImpact = function(data){
                service.fetch('js/data/decision/cancelsubscription.json',{}).then(function(response) {
                    self.subscription(response);
               });
            }

            self.projectStartDate = new Date("Jan 1, 2015").getTime();
            self.projectEndDate = new Date("Dec 31, 2020").getTime();

            self.getImapctChart = function(data){
                return new oj.ArrayTableDataSource(data.impacts,{idAttribute: 'id'});
            }

            self.formatRoundoffToOnedecimal = function(data){
            return numberconvertor.formatRoundoffToOnedecimal(data);
            };


            self.timeAxisWidth = ko.observable(0);      
            var dir = document.documentElement.getAttribute("dir");
            if (dir) {
                dir = dir.toLowerCase();
            }
            self.isRTL = (dir === 'rtl');

            self.monitorAxisWidth = function() {
                var timeAxis = $('#timeAxis');
                // After initial render, monitor time axis width
                self.timeAxisWidth(timeAxis.width());

                // monitor subsequent time axis width change due to window resize
                $(window).on('resize', function() {
                    self.timeAxisWidth(timeAxis.width());
                });
            };

            self.getPosition = function(taskStart) {
                return oj.TimeUtils.getPosition(taskStart, self.projectStartDate, self.projectEndDate, self.timeAxisWidth());
            };

            self.getLength = function(taskStart, taskEnd) {
                return oj.TimeUtils.getLength(taskStart, taskEnd, self.projectStartDate, self.projectEndDate, self.timeAxisWidth());
            };

            self.getAriaLabel = function(rowData) {
                var taskStartTime = new Date(rowData['start']);
                var taskEndTime = new Date(rowData['end']);

                var taskStart = 'Start date ' + taskStartTime.toDateString() + '. ';
                var taskEnd = 'End date ' + taskEndTime.toDateString() + '. ';
                var duration = 'Duration ' + (taskEndTime.getTime() - taskStartTime.getTime()) / (1000*60*60*24) + ' days. ';
                return taskStart + taskEnd + duration;
            };

            self.imactDetails = ko.observable(false);
            self.impactDetailDesc = ko.observable();
            self.impactDetailMagnitude = ko.observable();
            self.impactDetailPriority = ko.observable();
            self.impactDetailExpenseType = ko.observable();
            self.impactDetailExpenseValue = ko.observable();
            self.impactDetailStatus = ko.observable();

            self.displayDetails=function(event,data){
                if (data['option'] == 'currentRow' && data['value'] != null)
                {
                    self.imactDetails(true);
                    var rowIndex = data['value']['rowIndex'];
                    var obj = self.subscription._latestValue.impacts[rowIndex];
                    self.impactDetailDesc(obj.description);
                    self.impactDetailMagnitude(obj.magnitude);
                    self.impactDetailPriority(obj.priority);
                    self.impactDetailExpenseType(obj.expense.type);
                    self.impactDetailExpenseValue(obj.expense.date + ' & ' + obj.expense.amount);
                    self.impactDetailStatus(obj.status);
                }
            } 
    	}
    	return DecisionViewModel;
    }
);