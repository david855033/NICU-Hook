;'use strict';
//基礎函數：將HTTP request post至node server 等待callback回傳
var PostHTTPRequest=function(options, callback){
    $.ajax({
        url: "HTTPRequest",
        type:"POST",
        data: JSON.stringify(options),
        contentType: "application/json; charset=utf-8",
        dataType   : "text",
        success: function (data,status,xhr) {
            callback && callback(data,status,xhr);
        }
    })
};

//constructor for defualtOption of VGHserver
var defaulOption = function(){
    this.url="https://web9.vghtpe.gov.tw/";
    // this.url="https://www.google.com.tw/";
    this.rejectUnauthorized= false;
};

//server為放置所有與伺服器互動之namespace
var server={};
server.account="DOC3924B";
server.password="888888";

server.cookie={};
server.cookie.string="";
server.cookie.setString=function(str){
    server.cookie.string=str;
};

server.signIn=function(){

    if(!server.account||!server.password){
        console.log("account or password not set.");
        return;
    }

    var option = new defaulOption();
    option.url="https://web9.vghtpe.gov.tw/Signon/lockaccount";
    option.method='POST';
    option.form={j_username:server.account,j_password:server.password}

    PostHTTPRequest(option, function(data,status,xhr){
        resObj= JSON.parse(data);
        dev.content=resObj.body;
        console.log("RECIEVED COOKIE: "+ resObj.cookieString) ; // for dev
        console.log("RECIEVED STATUS: " + status);
        server.cookie.setString(resObj.cookieString);
        dev.cookie=server.cookie.string;
    });
};

server.get=function(url){
    var option = new defaulOption();
    option.url=url;
    option.headers={
        'Cookie': server.cookie.string
    }

    PostHTTPRequest(option, function(data,status,xhr){
        resObj= JSON.parse(data);
        dev.content=resObj.body;
        console.log("COOKIE: "+resObj.cookieString) ;
        console.log("STATUS: "+status);
        server.cookie.setString(resObj.cookieString);
        dev.cookie=server.cookie.string;
    });
}
