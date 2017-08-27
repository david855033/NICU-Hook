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
    getDateFromShortDate:function(dateString){
        if(typeof dateString =="string" && dateString.length==8)
        {
            return dateString.substr(0,4)+"-"+dateString.substr(4,2)+"-"+dateString.substr(6,2);
        }
        else{
            return dateString;
        } 
    },
    get2DigiNum:function(num){
        if(typeof num == "number" && num<10)
        {
            return "0"+num;
        }else{
            return num;
        }
    },
    //DOM manipulate
    removeElementsByTagName:function(HtmlElement, tagName)
    {
        var element = HtmlElement.getElementsByTagName(tagName), index;
        for (index = element.length - 1; index >= 0; index--) {
            element[index].parentNode.removeChild(element[index]);
        }
    },
    //--------轉換HTML--------
    //取得某病房的住院病人
    //[{bed:"NICU-1",name:"",patientID:"1234567",gender:"",section:"",admissionDate:""}]
    getAdmissionList:function(htmlText){
        var resultArray=[];
        var doc = Parser.getDOM(htmlText);
        var tbody = doc.getElementsByTagName("tbody");
        tbody = tbody&&tbody[0];
        if(!tbody){return;}
        var trs = tbody.getElementsByTagName("tr");
        for(var i = 0; i < trs.length; i++){
            var tr=trs[i];
            var tds=tr.getElementsByTagName("td");
            
            var result = {bed:"",name:"",patientID:"",gender:"",section:"",admissionDate:""};
            if(tds[1].getAttribute('id')=="tips")
            {
                Parser.removeElementsByTagName(tds[1],"span");
                result.bed=tds[1].innerText.replaceAll(' ','');
                result.name=tds[2].innerText.trim().replaceAll('@','');
                result.patientID=tds[3].innerText.trim();
                result.gender=tds[4].innerText;
                result.section=tds[5].innerText.trim();
                result.admissionDate=Parser.getDateFromShortDate(tds[7].innerText.trim());
                console.log(tr);
                resultArray.push(result);
            }
        }
        return resultArray;
    }
}
