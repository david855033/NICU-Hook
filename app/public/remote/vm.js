'use strict';
var SendHTTPRequest=function(options, callback){
    if(!options.port) {options.port='80';}
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
var Parser={
    getBodyContent:function(htmlText){
        var parsedString=htmlText.match(/<body>[\s\S]*<\/body>/);
        var resultString="";
        if(parsedString){
            resultString=parsedString[0];
            resultString=resultString.replace('<body>','');
            resultString=resultString.replace('</body>','');
        }
        return resultString;
    }
}

var vm = new Vue({
    el: '#vm',
    data: {
        recievedData:"",
        account:"",
        password:"",
        cookieContainer:""
    },
    methods:{
        signIn:function(){
            var remote = {
                hostname:"localhost",
                path:"/VGHServerStub/remote.html",
                port:3010,
                cookieContainer: vm.cookieContainer
            };
            SendHTTPRequest(remote,function(data,status,xhr){
                vm.recievedData = Parser.getBodyContent(data) + "</br>" + status + "</br> cookie: " + xhr.getResponseHeader('cookie-container');
                vm.cookieContainer=xhr.getResponseHeader('cookie-container');
            });
        }
    },
    mounted:function(){
        var remote = {
            hostname:"localhost",
            path:"/VGHServerStub/remote.html",
            port:3010
        };
        SendHTTPRequest(remote,function(data,status,xhr){
            vm.recievedData = Parser.getBodyContent(data) + "</br>" + status + "</br> cookie: " + xhr.getResponseHeader('cookie-container');
            vm.cookieContainer=xhr.getResponseHeader('cookie-container');
        });
    }
});