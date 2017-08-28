"use strict";
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
            .forEach(function(x){
                var parts=x.split('=');
                var key=parts.shift();
                var value=parts.join('=');
                keyValuePairs[key.trim()]=value.trim();
            });
        return keyValuePairs; 
    },
    getCookieStringFromKeyValuePairs:function(keyValuePairs){
         var keys= Object.keys(keyValuePairs);
         return keys.map(function(x){return x+"="+keyValuePairs[x];}).join('; ');
    },
    //時間日期
    getDateTime:function(dateObj){
        var toParse = dateObj || new Date();
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
    getTimeFromShortTime:function(timeString){
        if(typeof timeString =="string" && timeString.length==4)
        {
            return timeString.substr(0,2)+":"+timeString.substr(2,2);
        }
        else{
            return timeString;
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
    getPatientList:function(htmlText){
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
            var td1_id = tds[1].getAttribute('id');
            var td1_idIsTips = td1_id&&td1_id.indexOf("tips")>=0;
            if(td1_idIsTips)
            {
                Parser.removeElementsByTagName(tds[1],"span");
                result.bed=tds[1].innerText.replaceAll(' ','');
                result.name=tds[2].innerText.trim().replaceAll('@','');
                result.patientID=tds[3].innerText.trim();
                result.gender=tds[4].innerText;
                result.section=tds[5].innerText.trim();
                result.admissionDate=Parser.getDateFromShortDate(tds[7].innerText.trim());
                resultArray.push(result);
            }
        }
        return resultArray;
    },

    //取得某病患的住院清單
    //[{admissionDate:"2017-01-01",dischargeDate:"2017-01-02",caseNo:"1234567",section:""}]
    getAdmissionList:function(htmlText){
        var resultArray=[];
        var doc = Parser.getDOM(htmlText);
        var tbody = doc.getElementsByTagName("tbody");
        tbody = tbody&&tbody[0];
        if(!tbody){return resultArray;}
        var trs = tbody.getElementsByTagName("tr");
        for(var i = 0; i < trs.length; i++){
            var tr=trs[i];
            var tds=tr.getElementsByTagName("td");
            var result = {admissionDate:"",dischargeDate:"",caseNo:"",section:""};
            result.admissionDate=Parser.getDateFromShortDate(tds[2].innerText.trim());
            result.dischargeDate=Parser.getDateFromShortDate(tds[3].innerText.trim());
            result.caseNo=tds[1].innerText.trim();
            result.section=tds[4].innerText.trim();
            resultArray.push(result);
        }
        return resultArray;
    },
    getPatientData:function(htmlText){
        var result= { 
            currentBed:"",
            patientName:"",
            birthDate:"",
            gender:"",
            bloodType:"",
            currentSection:"",
            visitingStaff:{name:"",code:""},
            resident:{name:"",code:""}
        };
        var doc = Parser.getDOM(htmlText);
        var tbody = doc.getElementsByTagName("tbody");
        tbody = tbody&&tbody[0];
        if(!tbody){return result;}
        var trs = tbody.getElementsByTagName("tr");
        result.currentBed=trs[1].innerText.replaceAll('０２．　病房床號：','').replaceAll('－',"-").replaceAll(' ','');
        result.patientName=trs[2].innerText.replaceAll('０３．　姓　名　：','').trim();
        result.birthDate=Parser.getDateFromShortDate(trs[3].innerText.replaceAll('０４．　生　日　：','').regReplaceAll(/（.*）/g,"").trim());
        result.gender=trs[4].innerText.replaceAll('０５．　性　別　：','').trim();
        result.bloodType=trs[5].innerText.replaceAll('０６．　血　型　：','').replaceAll(' ','').trim();
        result.currentSection=trs[7].innerText.replaceAll('０８．　科　別　：','').trim();
        result.visitingStaff.name=trs[17].innerText.replaceAll('１８．　主治醫師：','').regReplaceAll(/\(.*\)/g,"").trim();
        result.visitingStaff.code=trs[17].innerText.replaceAll('１８．　主治醫師：','').regSelectAll(/\((.*)\)/g,"").regReplaceAll(/(\(|\))/g,"").trim();
        result.resident.name=trs[18].innerText.replaceAll('１９．　住院醫師：','').regReplaceAll(/\(.*\)/g,"").trim();
        result.resident.code=trs[18].innerText.replaceAll('１９．　住院醫師：','').regSelectAll(/\((.*)\)/g,"").regReplaceAll(/(\(|\))/g,"").trim();
        return result;
    },

    //轉科轉床(最近一次住院)
    //changeBed:[{dateTime:"",bed:""}],changeSection:[{dateTime:"",section:""}]
    getChangeBedSection:function(htmlText){
        var result={
            changeBed:[],
            changeSection:[]
        };
        var doc = Parser.getDOM(htmlText);
        var tbodyBed = doc.getElementById('tbody_2');
        if(tbodyBed){
            var trs = tbodyBed.getElementsByTagName("tr");
            for(var i = 0; i < trs.length; i++){
                var tr=trs[i];
                var tds=tr.getElementsByTagName("td");
                var changeBed={dateTime:"",bed:""};
                changeBed.dateTime=Parser.getDateFromShortDate(tds[0].innerText.trim())+" "+Parser.getTimeFromShortTime(tds[1].innerText.trim());
                changeBed.bed=tds[2].innerText;
                result.changeBed.push(changeBed);
            }
        }

        var tbodySection = doc.getElementById('tbody_3');
        console.log(tbodySection);
        if(tbodySection){
            var trs = tbodySection.getElementsByTagName("tr");
            for(var i = 0; i < trs.length; i++){
                var tr=trs[i];
                var tds=tr.getElementsByTagName("td");
                var changeSection={dateTime:"",bed:""};
                changeSection.dateTime=Parser.getDateFromShortDate(tds[0].innerText.trim())+" "+Parser.getTimeFromShortTime(tds[1].innerText.trim());
                changeSection.section=tds[2].innerText;
                result.changeSection.push(changeSection);
            }
        }
        return result;
    }
}
