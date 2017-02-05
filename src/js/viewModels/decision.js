'use strict';
define(['ojs/ojcore', 'knockout', 'jquery', 'viewModels/service/dataservice','viewModels/convertors/date','viewModels/convertors/number',
    'ojs/ojknockout','ojs/ojmodule', 'ojs/ojlistview', 'ojs/ojbutton','ojs/ojarraytabledatasource', 
    'ojs/ojinputText','ojs/ojdatetimepicker','ojs/ojmodel','ojs/ojnavigationlist','ojs/ojtabs','ojs/ojconveyorbelt',
    'ojs/ojtable','ojs/ojtimeutils', 'ojs/ojtimeaxis'],
    function(oj, ko, $, dataservice, dateconvertor, numberconvertor) {   
        var header = {};

        var decision_url = 'js/data/decision/decision.json';
        var cancelsubscription = 'js/data/decision/cancelsubscription.json';
        var impactdesires = 'js/data/decision/impactdesires.json';

    	function DecisionViewModel() {
            self.displaymenu(true);

            self.decisionAdviceBtnfn = function(event, ui) {
                if(ui.option === "checked") {
                    if($('#decision-btn-advice-selected').length > 0) {
                        $('#decision-btn-advice-selected').attr('id','decision-btn-advice');
                    } else {
                        $('#decision-btn-advice').attr('id','decision-btn-advice-selected');
                    }
                }
            }
            
            self.decisionConversationBtnfn = function(event, ui) {
                if(ui.option === "checked") {
                    if($('#decision-btn-conversations-selected').length > 0) {
                        $('#decision-btn-conversations-selected').attr('id','decision-btn-conversations');
                    } else {
                        $('#decision-btn-conversations').attr('id','decision-btn-conversations-selected');
                    }
                }
            }

            self.decisionAlternativeBtnfn = function(event, ui) {
                if(ui.option === "checked") {
                    if($('#decision-btn-alternative-selected').length > 0) {
                        $('#decision-btn-alternative-selected').attr('id','decision-btn-alternative');
                    } else {
                        $('#decision-btn-alternative').attr('id','decision-btn-alternative-selected');
                    }
                }
            }
            
    		self.title=ko.observable();
            self.description=ko.observable();
            self.duedate=ko.observable();
            self.alternatives=ko.observable();
            var decisionObj = {};

            dataservice.fetch(decision_url,header).then(function(response) {
                decisionObj =response["decision"];
                self.title(decisionObj.title);
                self.description(decisionObj.description);
                self.duedate(dateconvertor.formatToMedium(decisionObj.duedate));
                self.alternatives(new oj.ArrayTableDataSource(decisionObj.alternatives));
            });

            self.selectedAlternatives = ko.observable(false);
            self.subscription = ko.observable(false);
            self.projectStartDate = ko.observable(0);
            self.projectEndDate = ko.observable(0);
            self.desires = ko.observable();
            self.displayImpactDesires = ko.observable(false);

            self.loadDesireImpact = function(data){
                if(data == 1) {
                    dataservice.fetch(cancelsubscription, header).then(function(response) {
                        self.subscription(response);
                    });

                    dataservice.fetch(impactdesires, header).then(function(response) {
                        self.projectStartDate(response['startdate']);
                        self.projectEndDate(response['enddate']);
                        self.desires(new oj.ArrayTableDataSource(response['desires'],{idAttribute: 'id'}));
                        self.displayImpactDesires(true);
                    });
                } else {
                    self.displayImpactDesires(false);
                }
            }

            self.formatRoundoffToOnedecimal = function(data){
                return numberconvertor.roundoffToFirstdecimal(data);
            };

            self.displayDesiresChartlabel = function(event){
               if(event.row){
                    return "<ul><li style='color:"+event.row.color+"'> <span class='decision-desires-chart-label'>"+event.row.type 
                        +"</span> : <span class='decision-desires-chart-description'>"+event.row.description+"</span></li></ul>";
               }                
            }

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
                return oj.TimeUtils.getPosition(taskStart, self.projectStartDate(), self.projectEndDate(), self.timeAxisWidth());
            };

            self.getLength = function(taskStart, taskEnd) {
                return oj.TimeUtils.getLength(taskStart, taskEnd, self.projectStartDate(), self.projectEndDate(), self.timeAxisWidth());
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
                if (data['option'] == 'currentRow' && data['value'] != null) {
                    self.imactDetails(true);
                    var rowIndex = data['value']['rowIndex'];
                    var obj = self.desires._latestValue.data[rowIndex];
                    self.impactDetailDesc(obj.description);
                    self.impactDetailMagnitude(obj.magnitude);
                    self.impactDetailPriority(obj.priority);
                    self.impactDetailExpenseType(obj.expense.type);
                    self.impactDetailExpenseValue(obj.expense.date + ' & ' + obj.expense.amount);
                    self.impactDetailStatus(obj.status);
                }
            } 

            self.timeAxisConverter = ko.observable(dateconvertor.converterMMMYY());
    	}
    	return DecisionViewModel;
    }
);