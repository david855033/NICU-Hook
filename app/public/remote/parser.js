;'use strict';
var Parser={
    getDOM:function(htmlText){
        var doc = document.implementation.createHTMLDocument("example");
        doc.documentElement.innerHTML = htmlText;
        return doc;
    },
    //cookie
    getKeyValuePairsFromCookieString:function(cookieString){
        var keyValuePairs={};
        cookieString&&cookieString.split(';')
            .forEach((x)=>{
                var parts=x.split('=');
                var key=parts.shift();
                var value=parts.join('=');
                keyValuePairs[key.trim()]=value.trim();
            });
        return keyValuePairs; 
    },
    getCookieStringFromKeyValuePairs:function(keyValuePairs){
         var keys= Object.keys(keyValuePairs);
         return keys.map(x=>x+"="+keyValuePairs[x]).join('; ');
    },
    //時間日期
    getDateTime:function(dateObj){
        toParse = dateObj || new Date();
        var str = toParse.getFullYear()+"-"
            +(toParse.getMonth()+1)+"-"
            +toParse.getDate()+" "
            +toParse.getHours()+":"
            +toParse.getMinutes()+":"
            +toParse.getSeconds();
        return str;
    }
}
