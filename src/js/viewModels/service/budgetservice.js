'use strict';

define([],
function(){	

	function budgetTotal(allocation,spent){
        var diff = (allocation - spent);
        var val = diff/allocation;
        var percentage = 0;
        if(val < 1){
            percentage = (1 - val) * 100;
        } else {
            percentage = 100;
        }

        return {
            diff:diff,
            percentage:percentage
        }
    }

    function entertainmentTotal(context){
        var datasource = context.datasource;

        if (!datasource || datasource.totalSize() <= 0) {
            return;
        }

        var total = 0;
        var totalRowCount = datasource.totalSize();

        var addAmount = function(rowNum) {
            datasource.at(rowNum).then(function(row) {
                total = total + row['data']['amount'];
                if (rowNum < totalRowCount - 1) {
                    addAmount(rowNum + 1);
                } else {
                    var parentElement = $(document.getElementById("table:entertainment_total"));
                    parentElement.empty();
                    parentElement.append(total);
                    parentElement.addClass('oj-helper-text-align-right');
                }
            });
        };
        addAmount(0);
    }

    return {
    	computeBudgetTotal: budgetTotal,
        computeEntertainmentTotal: entertainmentTotal
    };

});