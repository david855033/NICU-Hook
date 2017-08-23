;'use strict';
//基礎函數：將HTTP request post至node server並用callback等待回傳
var PostHTTPRequest=function(options, callback){
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
};

//constructor for defualtOption of VGHserver
var defaulOption = function(){
    this.HTTPprotocol="HTTPS";
    this.hostname="web9.vghtpe.gov.tw";
    this.method= 'GET';
    this.rejectUnauthorized= false;
    this.headers={
        'Host':'web9.vghtpe.gov.tw',
        'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding':'gzip, deflate, br',
        'Accept-Language':'zh-TW,zh;q=0.8,en-US;q=0.6,en;q=0.4',
        'Connection':'keep-alive',
        'Upgrade-Insecure-Requests':'1',
        'User-Agent': "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"                    
    };
};

//server為放置所有與伺服器互動之namespace
var server={};
server.account;
server.password;
server.signIn=function(){
    if(!server.account||!server.password){
        console.log("account or password not set.");
        return;
    }
    var option = new defaulOption();
    option.path="/Signon/login.jsp";
    PostHTTPRequest(option, function(data,status,xhr){
        console.log("DATA: "+data + "</br>STATUS: " + status) ; // for dev
    });
};