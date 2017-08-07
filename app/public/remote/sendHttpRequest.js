;'use strict';
//將HTTP request post至node server並用callback等待回傳
var SendHTTPRequest=function(options, callback){
    $.ajax({
        url: "HTTPRequest",
        type:"POST",
        data: JSON.stringify(options),
        contentType: "application/json; charset=utf-8",
        dataType   : "text",
        success: function (msg, status, jqXHR) {
            callback && callback(msg, status, jqXHR);
        }
    })
}