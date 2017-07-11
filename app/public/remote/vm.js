'use strict';
var SendHTTPRequest=function(options){
    if(!options.port) {options.port='80';}
    $.ajax({
        url: "HTTPRequest",
        type:"POST",
        data: JSON.stringify(options),
        contentType: "application/json; charset=utf-8",
        dataType   : "text",
        success: function (msg, status, jqXHR) {
            vm.recievedData = Parser.getBodyContent(msg);
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
        password:""
    },
    methods:{
        signIn:function(){
            
        }
    },
    mounted:function(){
        var remote = {
            hostname:"localhost",
            path:"/VGHServerStub/remote.html",
            port:3010
        };
        SendHTTPRequest(remote);
    }
});