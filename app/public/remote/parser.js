"use strict";
var Parser={
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
    getDateFromString:function(str){
        if(!str){return new Date(str)||new Date();}
        var match_d=str.match(/\d{1,4}-\d{1,2}-\d{1,2}/);
        match_d=(match_d&&match_d[0])||"";
        if(match_d){
            var match_t=str.match(/\d{1,2}(:|\.)\d{1,2}((:|\.)\d{1,2})?/);
            match_t=(match_t&&match_t[0])||"";
            var d=match_d.split("-").map(function(x){return Number(x)});
            var t=[];
            t=match_t.split(":").map(function(x){return Number(x)});
            t[0]=t[0]||0;t[1]=t[1]||0;t[2]=t[2]||0;
            return new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]);
        };
    },
    getDateTime:function(dateObj){
        var toParse = dateObj || new Date();
        if(typeof dateObj=="string"){toParse=Parser.getDateFromString(dateObj);}
        var str = toParse.getFullYear()+"-"
            +this.get2DigiNum((toParse.getMonth()+1))+"-"
            +this.get2DigiNum((toParse.getDate()))+" "
            +this.get2DigiNum(toParse.getHours())+":"
            +this.get2DigiNum(toParse.getMinutes())+":"
            +this.get2DigiNum(toParse.getSeconds());
        return str;
    },
    getDate:function(dateObj){
        var toParse = dateObj || new Date();
        if(typeof dateObj=="string"){toParse= Parser.getDateFromString(dateObj);}
        var str = toParse.getFullYear()+"-"
            +this.get2DigiNum((toParse.getMonth()+1))+"-"
            +this.get2DigiNum((toParse.getDate()))
        return str;
    },
    getHour:function(dateObj){
        var toParse = dateObj || new Date();
        if(typeof dateObj=="string"){toParse=Parser.getDateFromString(dateObj);}
        var str = toParse.getHours();
        return str;
    },
    getMMDD:function(dateObj){
        var toParse = dateObj || new Date();
        if(typeof dateObj=="string"){toParse=Parser.getDateFromString(dateObj);}
        var str = this.get2DigiNum((toParse.getMonth()+1))+"/"
            +this.get2DigiNum((toParse.getDate()));
        return str;
    },
    getHHMM:function(dateObj){
        var toParse = dateObj || new Date();
        if(typeof dateObj=="string"){toParse=Parser.getDateFromString(dateObj);}
        var str = this.get2DigiNum(toParse.getHours())+":"
            +this.get2DigiNum(toParse.getMinutes());
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
    getDateTimeFromShortDateTime:function(dateTimeString)
    {
        var parts = dateTimeString.replaceAll('-',':').split(':');
        if(parts.length=2)
        {
            parts[0]=Parser.getDateFromShortDate(parts[0].trim());
            parts[1]=Parser.getTimeFromShortTime(parts[1].trim());
            return parts[0]+' '+parts[1];
        }
        return dateTimeString;
    },
    getDateTimeFromMedicationTable:function(inputString)
    {
        return inputString.regSelectAll(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)+" "+inputString.regSelectAll(/[0-9]{2}\.[0-9]{2}/).regReplaceAll('\.',":");
    },
    getShortDate:function(inputString){
        if(!inputString){return null};
        var result=String(inputString).regReplaceAll(/(\/|-|\\)/g,"");
        if(result.length>8) {result=result.slice(0,8);}
        return result;
    },
    get2DigiNum:function(num){
        if(typeof num == "number" && num<10)
        {
            return "0"+num;
        }else{
            return num;
        }
    },
    getSecondDifference:function(dateTime1, dateTime2){
        dateTime1==dateTime1||new Date();
        dateTime2==dateTime2||new Date();
        if(typeof dateTime1=="string"){
            var date1 = Parser.getDateFromString(dateTime1);
        }else{
            var date1 = new Date(dateTime1);
        }
        if(typeof dateTime2=="string"){
            var date2 = Parser.getDateFromString(dateTime2);
        }else{
            var date2 = new Date(dateTime2);
        }
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diff = Math.ceil(timeDiff / (1000)); 
        return diff?diff:0;
    },
    getDayDifference:function(dateTime1, dateTime2){
        dateTime1==dateTime1||new Date();
        dateTime2==dateTime2||new Date();
        if(typeof dateTime1=="string"){
            var date1 = Parser.getDateFromString(dateTime1);
        }else{
            var date1 = new Date(dateTime1);
        }
        if(typeof dateTime2=="string"){
            var date2 = Parser.getDateFromString(dateTime2);
        }else{
            var date2 = new Date();
        }
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diff = Number(Math.floor(timeDiff/1000/24/60/60).toFixed(0));
        return diff?diff:0;
    },
    getDayString:function(day){
        switch(day){
            case 0: return "星期日";
            case 1: return "星期一";
            case 2: return "星期二";
            case 3: return "星期三";
            case 4: return "星期四";
            case 5: return "星期五";
            case 6: return "星期六";
        }
    },
    getDayDifferenceString:function(currentDate){
        var dayDiff = Parser.getDayDifference(currentDate);
        if(dayDiff==0){
          return "今日";
        }else if (dayDiff<14){
            return dayDiff+"天前";
        }else if (dayDiff<60){
            return Math.floor(dayDiff/7).toFixed(0)+"周前";
        }else if (dayDiff<365){
            return Math.floor(dayDiff/30).toFixed(0)+"月前";
        }else{
            var remainDay = dayDiff%365;
            var month = Math.floor(remainDay/30).toFixed(0);
            return ((dayDiff-remainDay)/365).toFixed(0)+"年"+(month>0?(month+"月"):"")+"前";
        }
    },
    getAgeString:function(currentDate,birthday){
        if(!currentDate||!birthday||currentDate<birthday) return "null";
        var dayDiff = Parser.getDayDifference(currentDate,birthday);
        return Parser.getStrFromDayDiff(dayDiff);
    },
    getCorrectedAgeString:function(ageInDay){
        if(!ageInDay) return "null";
        var dayDiff=ageInDay-280;
        return Parser.getStrFromDayDiff(dayDiff);
    },
    getStrFromDayDiff:function(dayDiff)
    {
        if(dayDiff<31){
            return dayDiff+" d/o";
        }else if(dayDiff<365){
            var remainDay = Math.floor(dayDiff%(365/12));
            return ((dayDiff-remainDay)/(365/12)).toFixed(0)+"m"+(remainDay>0?(" "+remainDay+"d"):"");
        }else{
            var remainDay = dayDiff%365;
            var month = Math.floor(remainDay/(365/12)).toFixed(0);
            return ((dayDiff-remainDay)/365).toFixed(0)+"y"+(month>0?(" "+month+"m"):"");
        }
    },
    addDate:function(dateObj,delta)
    {
        var toParse = dateObj || new Date();
        if(typeof dateObj=="string"){toParse=Parser.getDateFromString(dateObj);}
        toParse.setDate(toParse.getDate() +delta);
        return Parser.getDate(toParse);
    },
    //DOM manipulate
    getDOM:function(htmlText){
        var doc = document.implementation.createHTMLDocument("example");
        doc.documentElement.innerHTML = htmlText;
        return doc;
    },
    removeElementsByTagName:function(HtmlElement, tagName)
    {
        var element = HtmlElement.getElementsByTagName(tagName), index;
        for (index = element.length - 1; index >= 0; index--) {
            element[index].parentNode.removeChild(element[index]);
        }
    },
    searchDomByID:function(HtmlElements, id){
        var allChildElement = HtmlElements.getElementsByTagName("*");
        for(var i = 0; i < allChildElement.length; i++)
        {
            if(allChildElement[i].getAttribute('id')&&allChildElement[i].getAttribute('id').indexOf(id)>=0)
            {
                return  allChildElement[i];
            }
        }  
        return null;
    },

    //html fix
    removeHtmlBlank:function(htmlText){
        return htmlText.regReplaceAll(/\\r/g,'').regReplaceAll(/\\n/g,'').regReplaceAll(/\\t/g,'').regReplaceAll(/\\\"/g,'').replaceNbsps().trim();
    },
    
    //number
    getNumberPartFromString:function(inputStr){
        var matchNum=inputStr.match(/\d+(.\d+)?/);
        matchNum=(matchNum &&Number(matchNum[0]))||null;
        return matchNum;
    },
    round1:function(input){
        var num=Number(input);
        return Math.round(input*10)/10;
    },
    round2:function(input){
        var num=Number(input);
        return Math.round(input*100)/100;
    },

    //ventilation
    ventilationSettingFromEvent:function(input){
        input=input.trim();
        var parts=input.split(' ');
        var modeString=parts.shift();
        var checkModeString=String(modeString).toLocaleLowerCase();
        if(checkModeString=="oett"||checkModeString=="nett"){
            modeString=parts.shift();
        }
        var settingString=parts.join(' ');
        settingString=settingString.regReplaceAll(/(\+|\,|\:|\(|\))/g,' ');
        settingString=settingString.regReplaceAll(/\s+/g,' ');
        var settingParts=settingString.split(' ');
       
        var parseCols=[];
        var modeStringCompare=String(modeString).toLocaleLowerCase();
        if(modeStringCompare.slice(0,4)=='hfov'){
            modeString='HFOV';
            if(modeStringCompare.indexOf('+no')>=0){
                modeString+='<br>NO';
            }
            parseCols.push(['FiO2','AMP','MAP','Freq']);
        }else if(modeStringCompare.slice(0,4)=='simv'){
            modeString='SIMV';
            parseCols.push(['FiO2','Rate','PIP','PEEP']);
        }else if(modeStringCompare.slice(0,2)=='np'){
            modeString='NP';
            parseCols.push(['FiO2','PEEP']);
            parseCols.push(['FiO2','Rate','PIP','PEEP']);
        }else if(modeStringCompare.slice(0,2)=='uw'){
            modeString='UW';
            parseCols.push(['FiO2','PEEP']);
        }

        var modifiedParts=[];
        for(var i = 0;i<settingParts.length;i++)
        {
            var abbr = settingParts[i].match(/\d+(.\d*)?(\/\d+(.\d*)?)*/); //is  */*/*/*  format
            if(abbr){
                var abbrparts=abbr[0].split('/');
                var currentParseCol=parseCols.find(function(x){return x.length==abbrparts.length})
                if(currentParseCol){
                    currentParseCol.forEach(function(x,index){modifiedParts.push(x+":"+span(abbrparts[index],['heavy-weight','s-word','blue-25-font']));})
                    continue;
                }
            }
            
            var key = settingParts[i];
            var value = settingParts[i+1]&&settingParts[i+1].match(/\d+(.\d+)?/);
            if(key&&value&&key.indexOf('/')<0){
                modifiedParts.push(key+":"+span(value[0],['heavy-weight','s-word','blue-25-font']));
                i++;
                continue;
            }
            modifiedParts.push(span(settingParts[i],['heavy-weight','s-word','blue-25-font']));
        }
        var resultString=modifiedParts.join(', ');
         
       
        return {mode:modeString,setting:resultString};
    }
}
