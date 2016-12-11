'use strict';
define(['ojs/ojcore','ojs/ojvalidation'],
    function(oj)
    {   
        var converterFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);

        function MMDDYYYY(data) {            
            var option = {formatStyle: 'date', isoStrFormat: 'auto', pattern:'MM/dd/yyyy'};
            return converterFactory.createConverter(option).format(data);
        }

        function medium(data) {            
            var option = {formatStyle: 'date', dateFormat:'medium'};
            return converterFactory.createConverter(option).format(data);
        }

        return {
            formatToMMDDYYYY:MMDDYYYY,
            formatToMedium:medium
        };
    }
);