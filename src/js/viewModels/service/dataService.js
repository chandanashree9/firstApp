'use strict';

define(['jquery'], 
  function($){

  var header = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With",
    "Access-Control-Allow-Methods":"GET, PUT, POST"
  };

  function GET(url,h){
    var promise = new Promise(
    function(resolve, reject) {
      $.extend( header, h );

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