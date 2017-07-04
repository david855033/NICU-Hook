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
                    hostname: 'www.google22.com.tw',
                    path: '/',
                    method:"GET"
                 }),
                contentType: "application/json; charset=utf-8",
                dataType   : "text",
                success: function (msg, status, jqXHR) {
                    vm.recievedData = msg;
                    console.log('ok');
                }
            })
        }
    }
});