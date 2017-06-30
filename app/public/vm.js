'use strict';
var vm = new Vue({
    el: '#vm',
    data: {
        recievedData:""
    },
    methods:
    {
        HTTPRequest:function(){
            $.ajax({
                url: "HTTPRequest",
                type:"POST",
                data: JSON.stringify({ 
                    "hostname": "www.google.com.tw",
                    "method": "GET",
                    "path":"/"
                 }),
                contentType: "application/json; charset=utf-8",
                dataType   : "json",
                success:function(result){vm.recievedData=result;}
            });
        }
    }
});