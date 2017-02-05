'use strict';
define(['ojs/ojcore','ojs/ojvalidation'],
function(oj)
{   
    var converterFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);

    function mmddyyyy(data) {            
        var option = {formatStyle: 'date', isoStrFormat: 'auto', pattern:'MM/dd/yyyy'};
        return converterFactory.createConverter(option).format(data);
    }

    function longDateTime(data) { 
        var option = {formatStyle: 'datetime', isoStrFormat: 'auto',  pattern:'MMMM dd,yyyy. h:mm a'};
        var result = converterFactory.createConverter(option).format(data);
        return result;
    }

    function medium(data) {            
        var option = {formatStyle: 'date', dateFormat:'medium'};
        return converterFactory.createConverter(option).format(data);
    }

    function mmmyyConverter() {            
        var option = {formatStyle: 'date', pattern: 'MMM yy'};
        return converterFactory.createConverter(option);
    }

    return {
        formatToMMDDYYYY:mmddyyyy,
        formatToLongDateTime:longDateTime,
        formatToMedium:medium,
        converterMMMYY:mmmyyConverter
    };
});