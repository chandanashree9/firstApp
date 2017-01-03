'use strict';

define(['ojs/ojcore','ojs/ojvalidation'],
    function(oj)
    {   
        var converterFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER);

        function currencyConverter(){
            var option = {style: 'currency', currency: 'USD', decimalFormat:'short', maximumFractionDigits:0};
            return converterFactory.createConverter(option);
        }

        function currencyformater(data){
            var option = {style: 'currency', currency: 'USD', decimalFormat:'short', maximumFractionDigits:2};
            return converterFactory.createConverter(option).format(data); 
        }

        function roundoffToSeconddecimal(data) {
            var option = { maximumFractionDigits : 2, minimumFractionDigits : 2,  minimumIntegerDigits : 2, style : "decimal", useGrouping : true };
            return converterFactory.createConverter(option).format(data);            
        }

        function roundoffToFirstdecimal(data){
            var option = {style:"decimal", decimalFormat:"short", minimumFractionDigits:1};
            return converterFactory.createConverter(option).format(data);
        }

    return {
        currencyConverter:currencyConverter,
        currencyformater:currencyformater,
        roundoffToSeconddecimal:roundoffToSeconddecimal,        
        roundoffToFirstdecimal:roundoffToFirstdecimal
    };
});