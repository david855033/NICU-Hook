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
            +this.get2DigiNum((toParse.getMonth()+1))+"-"
            +this.get2DigiNum((toParse.getDate()))+" "
            +this.get2DigiNum(toParse.getHours())+":"
            +this.get2DigiNum(toParse.getMinutes())+":"
            +this.get2DigiNum(toParse.getSeconds());
        return str;
    },
    get2DigiNum:function(num){
        if(typeof num == "number" && num<10)
        {
            return "0"+num;
        }else{
            return num;
        }
    },
    //資料格式
    //admisionList: [{bed:"NICU-1",name:"",patientID:"1234567",gender:"",section:"",admissionDate:""}]
    getAdmissionList:function(htmlText){
        var resultArray=[];
        var doc = Parser.getDOM(htmlText);
        var tbody = doc.getElementsByTagName("tbody");
        tbody = tbody&&tbody[0];
        var trs = tbody.getElementsByTagName("tr");
        for(var i = 0; i < trs.length; i++){
            var tr=trs[i];
            var tds=tr.getElementsByTagName("td");
            
            var result = {bed:"",name:"",patientID:"",gender:"",section:"",admissionDate:""};
            if(tds[1].getAttribute('id')=="tips")
            {
                console.log("Y: "+result.bed);
            }else{
                console.log("N: "+result.bed);
            }
            resultArray.push(result);
        }
        return resultArray;
    }
}
