'use strict';

define(['jquery'], 
	function($){

		function GET(url,header){
    	var promise = new Promise(
  			function(resolve, reject) {
  				$.ajax({ url: url, header: header, method: "GET", dataType: 'json', contentType: 'application/json; charset=UTF-8'})
  				.done(function(response) {
            resolve(response);
           })
  				.fail(function(response){
          	reject(response);
        	});
  			});

    	return promise;
  	}
      	
  return {
		fetch:GET
	};
});