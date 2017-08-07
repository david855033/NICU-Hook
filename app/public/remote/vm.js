'use strict';

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
            var options = {
                HTTPprotocol:"HTTPS",
                hostname:"web9.vghtpe.gov.tw",
                method: 'GET',
                path:"/Signon/login.jsp",
                rejectUnauthorized: false,
                headers:{
                    'Host':'web9.vghtpe.gov.tw',
                    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Encoding':'gzip, deflate, br',
                    'Accept-Language':'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4',
                    'Connection':'keep-alive',
                    'Upgrade-Insecure-Requests':'1',
                    'User-Agent': "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"                    
                }
            };
            SendHTTPRequest(options,function(data,status,xhr){
                vm.recievedData = "DATA: "+data + "</br>STATUS: " + status ;
            });
        }
    }
});