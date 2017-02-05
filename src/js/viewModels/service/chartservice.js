'use strict';

define(['ojs/ojcore', 'knockout', 'viewModels/service/dataservice'],
function(oj, ko, dataservice){	

    var chart1_url = 'js/data/home/chart/chart1.json';
    var chart5_url = 'js/data/home/chart/chart5.json';
    var chart10_url = 'js/data/home/chart/chart10.json';
    var chart15_url = 'js/data/home/chart/chart15.json';
    var chart20_url = 'js/data/home/chart/chart20.json';   

    function chartData(dataservice, chartlink, header){
    	if(chartlink === ''){
    		chartlink = chart1_url;
    	}
        dataservice.fetch(chartlink,header).then(function(response) {
            var grp = response['group'];
            if(grp && grp.length > 0) {
                var grplist = [];
                grp.forEach(function (a) {
                   grplist.push(a); 
                });
                self.groupValues(grplist);
            }
            
            var data = [    
                { name:'Total Asset Value', items: response['total_asset'] },
                { name:'Desired Value', items: response['desired'] },
                { name:'Liquid Value', items: response['liquid'] }
            ];
            self.seriesValues(data);
        });
    }

    function timeViewChart(data) {
        if(data && data.value) {
            switch(data.value[0]) {
            case 5:
                chartData(dataservice, chart5_url, header);
                break;
            case 10:
                chartData(dataservice, chart10_url, header);
                break;
            case 15:
                chartData(dataservice, chart15_url, header);
                break;
            case 20:
                chartData(dataservice, chart20_url, header);
                break;
            default:
                chartData(dataservice, chart1_url, header);
                break;
            }                    
        }                
    }

    return {
    	fetchChartData:chartData,
    	launchTimeViewChart: timeViewChart
    };
});