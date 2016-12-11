'use strict';
define(['ojs/ojcore','ojs/ojvalidation'],
    function(oj)
    {   
        var converterFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER);

    	function formatAmount(data) {
            var option = { "maximumFractionDigits" : 2, "minimumFractionDigits" : 2,  "minimumIntegerDigits" : 2, "style" : "decimal", "useGrouping" : true };
            return converterFactory.createConverter(option).format(data);            
    	}

        function currencyConvertorformat(){
            var option = {style: 'currency', currency: 'USD', decimalFormat:'short', maximumFractionDigits:0};
            return converterFactory.createConverter(option);
        }

    	return {
            formatAmount:formatAmount,
            currencyConvertorformat:currencyConvertorformat
        };
    }
);