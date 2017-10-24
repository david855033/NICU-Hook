;"use strict";
var cell=function(htmlText,classes,tooltip)
{
    this.htmlText=htmlText;
    this.classes=classes||[];
    this.tooltip=tooltip;
};
var span=function(htmlText,classes)
{
    var classString = "";
    if(classes){classString=" class='"+classes.join(" ")+"'";}
    return "<span"+classString+">"+htmlText+"</span>";
};
var div=function(htmlText,classes)
{
    var classString = "";
    if(classes){classString=" class='"+classes.join(" ")+"'";}
    return "<div"+classString+">"+htmlText+"</div>";
};
var FS=view.flowSheet;
var Layout=Layout||{};

var viewRender={};
viewRender.bw={};
viewRender.bw.parsed=[];
viewRender.bw.initialize=function(rawBW){
    if(!rawBW||!rawBW.colNames){
        return;
    }
    var indexDate = rawBW.colNames.indexOf("日期時間");
    var indexBW = rawBW.colNames.indexOf("體重");
    var parsedbw=[];
    var lastPushedDateTime="";
    rawBW.data.forEach(function(x){
        if(x[indexDate]!=lastPushedDateTime){
            parsedbw.push({dateTime:x[indexDate],bw:Parser.getNumberPartFromString(x[indexBW])});
            lastPushedDateTime=x[indexDate];
        }
    });
    parsedbw.sort(function(a,b){return Parser.getDateFromString(a.dateTime)-Parser.getDateFromString(b.dateTime)});
    
    var firstBwObj=(parsedbw&&parsedbw[0])||null;
    if(firstBwObj){
        FS.bwFirst=firstBwObj.bw;
        if(Parser.getDayDifference(firstBwObj.dateTime,FS.birthday)<=1){
            FS.bbw=firstBwObj.bw;
        }else{
            FS.bbw=null;
        }
    }else{
        FS.bwFirst=null;
    }
    viewRender.bw.parsed=parsedbw;
}
viewRender.bw.selectBw=function(){
    var parsedbw=viewRender.bw.parsed;

    var lastIndexToday=parsedbw.findLastIndexOf(function(x){
        return Parser.getDate(x.dateTime)<=FS.currentDate;}
    );
    var lastBwObj=(parsedbw&&(parsedbw[lastIndexToday]||parsedbw.slice(-1)[0]))||null;
    if(lastBwObj){
        FS.bwLast=lastBwObj.bw;
        FS.bwLastDate=Parser.getDate(lastBwObj.dateTime);
    }else{
        FS.bwLast=null;
        FS.bwLastDate=null;
    }

    var yesterday = Parser.getDateFromString(FS.currentDate);
    yesterday.setDate(yesterday.getDate() -1);
    yesterday=Parser.getDate(yesterday);
    var lastIndexYesterday=parsedbw.findLastIndexOf(function(x){
        return Parser.getDate(x.dateTime)==yesterday;}
    );
    var yesterdayBwObj=(parsedbw&&parsedbw[lastIndexYesterday])||null;
    if(yesterdayBwObj&&lastBwObj){
        FS.bwDelta = lastBwObj.bw - yesterdayBwObj.bw;
    }else{
        FS.bwDelta=null;
    } 
}
viewRender.bw.getBWForCalculateByDate=function(dateString){
    var parsedbw=viewRender.bw.parsed;
    var realAgeInDay = Number(Parser.getDayDifference(FS.birthday, dateString));
    if(realAgeInDay<7&&FS.bbw){
        return {dateTime:FS.birthday,bw:FS.bbw};
    }
    var lastIndexToday=parsedbw.findLastIndexOf(function(x){
        return Parser.getDate(x.dateTime)<=Parser.getDate(dateString)}
    );
    var lastBwObj=(parsedbw&&(parsedbw[lastIndexToday]||parsedbw.slice(-1)[0]))||null;
    return lastBwObj;
}

viewRender.header={
    initialize:function(){ 
        var headerCards=[];
        FS.weekDay=Parser.getDayString(Parser.getDateFromString(FS.currentDate).getDay());
        FS.dayDifference= Parser.getDayDifferenceString(FS.currentDate);
        FS.dayDifference+=" / 住院第"+Parser.getDayDifference(FS.currentDate,FS.admissionDate)+"天";
        headerCards.push(new this.headerCard(FS.bed,FS.name,"主治醫師："+FS.vs));
        
        var admissionDateStr="";
        if(FS.dischargeDate&&FS.admissionDate){
            admissionDateStr="住院："+FS.admissionDate+" 離院："+FS.dischargeDate;
        }else if(FS.admissionDate){
            admissionDateStr="住院日期:"+FS.admissionDate+"(住院中)";
        }
        headerCards.push(new this.headerCard("病歷號",FS.patientID,admissionDateStr,{cardId:"admission-card"}));
        
        
        if(!FS.GAweek){ //no GA
        }else if(FS.GAweek<37){  //preterm
            var ageInDay=Number(Parser.getDayDifference(FS.birthday, FS.currentDate))+Number(FS.GAweek)*7+Number(FS.GAday);
            var GAString="GA："+FS.GAweek + (FS.GAday>0?("+"+FS.GAday):"wk");
            var cGAWeek = Math.floor(ageInDay/7);
            var cGADay = (ageInDay)%7;
            var cGAString = cGAWeek + (cGADay>0?("+"+cGADay):"wk");
            if(cGAWeek<40){
                headerCards.push(new this.headerCard("矯正週數",cGAString,GAString));            
            }else if(ageInDay<=365){
                var correctedAgeStr=Parser.getCorrectedAgeString(ageInDay);
                headerCards.push(new this.headerCard("矯正年齡",correctedAgeStr,GAString));
            }
        }else{// fullterm
            headerCards.push(new this.headerCard("出生週數",FS.GAweek+(FS.GAday?("+"+FS.GAday):"")));
        }

        var ageStr=Parser.getAgeString(FS.currentDate,FS.birthday);
        headerCards.push(new this.headerCard("實際年齡",ageStr,"生日："+FS.birthday));
        
        var bwString="體重";
        viewRender.bw.selectBw();
        if(FS.bwForCalculate){
            if(FS.bwForCalculate>=5){
                bwString="設定體重："+Math.round(FS.bwForCalculate*100)/100+"kg";
            }else{
                bwString="設定體重："+Math.round(FS.bwForCalculate*1000)+"g";
            }
        }else if(FS.bbw&&Number(Parser.getDayDifference(FS.birthday, FS.currentDate))<7){
            bwString="(小於一週使用出生體重)";
        };
        var currentBWString="";
        var delta="";
        if(FS.bwLast){
            if(FS.bwLast<=5){
                currentBWString=Math.round(FS.bwLast*1000)+"g";
                delta=Math.round(FS.bwDelta*1000);
            }
            else{
                currentBWString=Math.round(FS.bwLast*100)/100+"kg";
                delta=Math.round(FS.bwDelta*100)/100;
            }
            if(FS.bwLastDate==FS.currentDate&&FS.bwDelta!=null){
                currentBWString+="<span class='s-word grey-40-font'>(";
                if(FS.bwDelta>0){
                    currentBWString+="+"+delta;
                }else{
                    currentBWString+=delta;
                }
                currentBWString+=")</span>"
            }else{
                currentBWString+="<span class='s-word grey-40-font'>("+
                Parser.getMMDD(FS.bwLastDate)+")</span>";
            }
        }
        var bbwString="";
        if(FS.bbw&&Number(Parser.getDayDifference(FS.birthday, FS.currentDate))<180){
            bbwString="出生體重："+Math.round(FS.bbw*1000)+"g";
        }else if(FS.bwFirst){
            if(FS.bwFirst<=5){
                var bwFirstString=Math.round(FS.bwFirst*1000)+"g";
            }else{
                var bwFirstString=Math.round(FS.bwFirst*100)/100+"kg";
            }
            bbwString="住院體重："+bwFirstString;
        }
        headerCards.push(new this.headerCard(bwString,currentBWString,bbwString,{cardId:"bw-card"}));

        FS.headerCards=headerCards;
    },
    headerCard:function(top,mid,bottom,id){
        this.top=top;
        this.mid=mid;
        this.bottom=bottom;
        id&&id.top&&(this.topId=id.top);
        id&&id.mid&&(this.midId=id.mid);
        id&&id.bottom&&(this.bottomId=id.bottom);
        id&&id.cardId&&(this.cardId=id.cardId);
    }
};

//flowsheet: 用來處理flowSheet資料並push進入 'toShow'
viewRender.flowSheet={};
viewRender.flowSheet.dataContainer=[];
viewRender.flowSheet.limit={
    hr:function(ageInDay){
        if(ageInDay<0){return [100,180];}
        else if(ageInDay<365){return [80,160];}
        else if(ageInDay<365*2){return [80,130];}
        else if(ageInDay<365*4){return [80,120];}
        else if(ageInDay<365*6){return [75,115];}
        else if(ageInDay<365*8){return [70,110];}
        else if(ageInDay<365*12){return [65,105];}
        else if(ageInDay<365*14){return [60,100];}
        else if(ageInDay<365*16){return [55,95];}
        return [50,90];
    },
    resp:function(ageInDay){
        if(ageInDay<30){return [20,60];}
        else if(ageInDay<365*3){return [20,40];}
        else if(ageInDay<365*6){return [10,30];}
        else if(ageInDay<365*12){return [10,25];}
        return [10,20];
    },
    spo2:function(ageInDay){
        if(ageInDay<0){return [90,];}
        return [95,];
    },
    sbp:function(ageInDay){
        if(ageInDay<-7*14){return [40,];}
        if(ageInDay<-7*12){return [45,];}
        else if(ageInDay<-7*8){return [50,];}
        else if(ageInDay<-7*4){return [55,];}
        else if(ageInDay<30){return [60,85];}
        else if(ageInDay<365*1){return [70,105];}
        else if(ageInDay<365*3){return [75,105];}
        else if(ageInDay<365*6){return [80,115];}
        else if(ageInDay<365*10){return [90,130];}
        return [90,140];
    },
    dbp:function(ageInDay){
        if(ageInDay<-7*14){return [20,];}
        if(ageInDay<-7*12){return [25,];}
        else if(ageInDay<-7*8){return [30,];}
        else if(ageInDay<-7*4){return [30,];}
        else if(ageInDay<30){return [35,];}
        else if(ageInDay<365*1){return [40,80];}
        else if(ageInDay<365*3){return [45,85];}
        else if(ageInDay<365*6){return [50,90];}
        else if(ageInDay<365*10){return [50,90];}
        return [50,100];
    },
    mbp:function(ageInDay){
        if(ageInDay<-7*14){return [30,];}
        if(ageInDay<-7*12){return [35,];}
        else if(ageInDay<-7*8){return [35,];}
        else if(ageInDay<-7*4){return [40,];}
        else if(ageInDay<30){return [45,];}
        else if(ageInDay<365*1){return [45,];}
        else if(ageInDay<365*3){return [50,];}
        else if(ageInDay<365*6){return [55,];}
        else if(ageInDay<365*10){return [60,];}
        return [65,];
    },
};
viewRender.flowSheet.selectDate=function(date){
    var ageInDay = Number(Parser.getDayDifference(FS.birthday, FS.currentDate))+Number(FS.GAweek)*7+Number(FS.GAday)-280;
    var toShow=viewRender.toShow;
    //清空資料 設定初始
    toShow.bt={limit:[36,38],data:[]};
    toShow.hr={limit:viewRender.flowSheet.limit.hr(ageInDay),data:[]};
    toShow.resp={limit:viewRender.flowSheet.limit.resp(ageInDay),resp:[]};
    toShow.spo2={limit:viewRender.flowSheet.limit.spo2(ageInDay),data:[]};
    toShow.sbp={limit:viewRender.flowSheet.limit.sbp(ageInDay),data:[]};
    toShow.dbp={limit:viewRender.flowSheet.limit.dbp(ageInDay),data:[]};
    toShow.mbp={limit:viewRender.flowSheet.limit.mbp(ageInDay),data:[]};
    toShow.infusion=[];
    toShow.transfusion=[];
    toShow.feeding=[];
    toShow.excretion=[];
    toShow.drain=[];
    toShow.ventilatorSetting=[];
    toShow.events=[];

    var dataContainer=viewRender.flowSheet.dataContainer;
    dataContainer.forEach(function(x){x.flowSheet.date=x.date});
    console.log(dataContainer);
    var flowSheetToday=dataContainer.find(function(x){return x.date==date}).flowSheet;
    var flowSheetTommorrow=dataContainer.find(function(x){return x.date==Parser.addDate(date,1);}).flowSheet;
    var flowSheetTommorrowEventFiltered={
       event: flowSheetTommorrow.event.filter(function(x){return x.time.localeCompare("07:00")<0;}),
       date:flowSheetTommorrow.date
    }   
    var flowSheetDay2=dataContainer.find(function(x){return x.date==Parser.addDate(date,-1);}).flowSheet;
    var flowSheetDay3=dataContainer.find(function(x){return x.date==Parser.addDate(date,-2);}).flowSheet;
    flowSheetToday.bwSelect=viewRender.bw.getBWForCalculateByDate(date);
    flowSheetDay2.bwSelect=viewRender.bw.getBWForCalculateByDate(Parser.addDate(date,-1));
    flowSheetDay3.bwSelect=viewRender.bw.getBWForCalculateByDate(Parser.addDate(date,-2));

    viewRender.flowSheet.calculateMBP(flowSheetToday);
    viewRender.flowSheet.calculateMBP(flowSheetTommorrow);
    viewRender.flowSheet.parseChart('bodyTemperature','bt',flowSheetToday,flowSheetTommorrow,{underLimitStyle:['blue','blue-bg','heavy-weight']});
    viewRender.flowSheet.parseChart('heartRate','hr',flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseChart('respiratoryRate','resp',flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseChart('saturation','spo2',flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseChart('sbp','sbp',flowSheetToday,flowSheetTommorrow,{overLimitStyle:['yellow','yellow-bg','heavy-weight']});
    viewRender.flowSheet.parseChart('dbp','dbp',flowSheetToday,flowSheetTommorrow,{overLimitStyle:['yellow','yellow-bg','heavy-weight']});
    viewRender.flowSheet.parseChart('mbp','mbp',flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseInfusion('peripheral',flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseInfusion('aline',flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseInfusion('central',flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.sortInfusion();
    viewRender.flowSheet.parseTransfusion(flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseFeeding('POAmount','PO',flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseFeeding('NGAmount','NG/OG',flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseFeeding('RVAmount','RV',flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseFeeding('NGDrain','NG/OG Drain',flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseExcretion('urine','Urine',flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseExcretion('stool','Stool',flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseExcretion('enema','Enema/Sti.',flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseDrain(flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseIO(flowSheetToday,flowSheetTommorrow,flowSheetDay2,flowSheetDay3);
    viewRender.flowSheet.parseEvent([flowSheetToday,flowSheetTommorrowEventFiltered,flowSheetDay2,flowSheetDay3]);
};
viewRender.flowSheet.calculateMBP=function(flowSheet){
    var sbp=flowSheet.sbp;
    var dbp=flowSheet.dbp;
    flowSheet.mbp=[];
    sbp.forEach(function(thisSBP){
        var thisDBP = dbp.find(function(x){return x.time==thisSBP.time});
        if(thisSBP.value&&thisDBP&&thisDBP.value){
            var MBP = Math.round(thisDBP.value*2/3 + thisSBP.value/3);
            flowSheet.mbp.push({time:thisSBP.time,value:MBP});
        }
    })
}
viewRender.flowSheet.parseChart=function(fieldOrigin,fieldTarget,flowSheetToday,flowSheetTommorrow,option){
    var dataDay1=flowSheetToday[fieldOrigin].map(function(x){x.hr=Number(x.time.split(':')[0]);return x;});
    var dataDay2=flowSheetTommorrow[fieldOrigin].map(function(x){x.hr=Number(x.time.split(':')[0]);return x;});
    var dataDay1=dataDay1.filter(function(x){return x.hr>=7;});
    var dataDay2=dataDay2.filter(function(x){return x.hr<=6;});
    var dataAll=dataDay1.concat(dataDay2);
    var parsedValue=[];
    var limit = viewRender.toShow[fieldTarget].limit||[];
    dataAll.forEach(function(x){
        var index = x.hr-7;
        if(index<0){index+=24;}
        var value=x.value;
        parsedValue[index]=parsedValue[index]||[];
        if(!parsedValue[index].find(function(x){return x==value})){
            parsedValue[index].push(value);
        }
    })

    var parsed=[];
    parsedValue.forEach(function(value,index){
        parsed[index]=parsed[index]||"";
        var underLimitStyle=(option&&option.underLimitStyle)||['red','red-bg','heavy-weight'];
        var overLimitStyle=(option&&option.overLimitStyle)||['red','red-bg','heavy-weight'];
        if(value.length==1)
        {
            var defaultStyle=['td-data','arial','h1-1'];
            if(limit[0]&&value<limit[0]){
                parsed[index]=div(div(value,['v-center']),underLimitStyle.concat(defaultStyle));
            }else if(limit[1]&&value>=limit[1]){
                parsed[index]=div(div(value,['v-center']),overLimitStyle.concat(defaultStyle));
            }else{
                parsed[index]=div(div(value,['v-center']),defaultStyle);
            }
        }else{
            var max=d3.max(value);
            var defaultStyle=['td-data','arial','h1-2'];
            if(limit[0]&&max<limit[0]){
                max=div(div(max,['v-center']),underLimitStyle.concat(defaultStyle));
            }else if(limit[1]&&max>=limit[1]){
                max=div(div(max,['v-center']),overLimitStyle.concat(defaultStyle));
            }else{
                max=div(div(max,['v-center']),defaultStyle);
            }
            
            var min=d3.min(value);
            
            if(limit[0]&&min<limit[0]){
                min=div(div(min,['v-center']),underLimitStyle.concat(defaultStyle));
            }else if(limit[1]&&min>=limit[1]){
                min=div(div(min,['v-center']),overLimitStyle.concat(defaultStyle));
            }else{
                min=div(div(min,['v-center']),defaultStyle);
            }
            
            parsed[index]=max+min;
        }
        
    })
    viewRender.toShow[fieldTarget].data=parsed;
};
viewRender.flowSheet.parseInfusion=function(fieldOrigin,flowSheetToday,flowSheetTommorrow,option){
    var dataDay1=flowSheetToday[fieldOrigin].filter(function(x){return x.amount.slice(7,24).find(function(y){return y;})});
    var dataDay2=flowSheetTommorrow[fieldOrigin].filter(function(x){return x.amount.slice(0,8).find(function(y){return y;})});
    var keys=[];
    dataDay1.forEach(function(x){viewRender.flowSheet.mergeDistinctKeys(x,keys);})
    dataDay2.forEach(function(x){viewRender.flowSheet.mergeDistinctKeys(x,keys);})
    var Combined=[];
    keys.forEach(function(k){
        var newData = {route:k.route,name:k.name,amount:[],priority:0,sum:0,delta:[]};
        if(fieldOrigin=="peripheral"){newData.priority=1;}
        else if(fieldOrigin=="aline"){newData.priority=2;}
        else if(fieldOrigin=="central"){newData.priority=3;}
        var amountDay1=dataDay1.filter(function(x){return k.route==x.route&&k.name==x.name;});
        var amount0=0;
        amountDay1.forEach(function(x){
            amount0+=amountDay1[6]||0
            for(var i = 0; i <= 16;i++){
                var h = i + 7;
                newData.amount[i]=newData.amount[i]||0;
                newData.amount[i]+=x.amount[h]||0;
                newData.sum+=x.amount[h]||0;
            }
        })
        var amountDay2=dataDay2.filter(function(x){return k.route==x.route&&k.name==x.name;});
        amountDay2.forEach(function(x){
            for(var i = 16; i <= 23;i++){
                var h = i + 7 - 24;
                newData.amount[i]=newData.amount[i]||0;
                newData.amount[i]+=x.amount[h]||0;
                newData.sum+=x.amount[h]||0;
            }
        })
        newData.amount.forEach(function(x,index){
            var delta=0;
            var previous=0;
            if(index==0){previous=amount0;}else{previous=newData.amount[index-1];}
            if(previous&&x)
            {
                if(x>previous){delta=1;}
                else if(x<previous){delta=-1;}
            }
            newData.delta.push(delta);
        })
        Combined.push(newData);
    });
    Combined.forEach(function(x){
        if(x.amount.find(function(y){return y!=0;})){
            x.amount=x.amount.map(function(y){return y&&Parser.round1(y)});
            x.sum=Parser.round1(x.sum);
            viewRender.toShow.infusion.push(x);
        }
    });
};
viewRender.flowSheet.mergeDistinctKeys=function(InfusionArray,keys){
    var route=String(InfusionArray.route).trim();
    var name=String(InfusionArray.name).trim();
    if(!keys.find(function(x){return x.route.toLowerCase()==route.toLowerCase()&&x.name.toLowerCase()==name.toLowerCase();})){
        keys.push({route:route,name:name});
    }
}
viewRender.flowSheet.sortInfusion=function(){
    viewRender.toShow.infusion=viewRender.toShow.infusion.sort(function(x,y){ 
        if(x.priority!=y.priority){return x.priority-y.priority;}
        else if(x.route!=y.route){return String(x.route).localeCompare(y.route)}
        else{return String(x.name).localeCompare(y.name)}
    });
}
viewRender.flowSheet.parseTransfusion=function(flowSheetToday,flowSheetTommorrow){
    var dataDay1=flowSheetToday['transfusion'].filter(function(x){return x.amount.slice(7,24).find(function(y){return y;})});
    var dataDay2=flowSheetTommorrow['transfusion'].filter(function(x){return x.amount.slice(0,8).find(function(y){return y;})});
    var keys=[];
    dataDay1.forEach(function(x){viewRender.flowSheet.mergeDistinctKeys(x,keys);})
    dataDay2.forEach(function(x){viewRender.flowSheet.mergeDistinctKeys(x,keys);})
    var Combined=[];
    keys.forEach(function(k){
        var newData = {route:k.route,name:k.name,amount:[],sum:0};
        var amountDay1=dataDay1.filter(function(x){return k.route==x.route&&k.name==x.name;});
        amountDay1.forEach(function(x){
            for(var i = 0; i <= 16;i++){
                var h = i + 7;
                newData.amount[i]=newData.amount[i]||0;
                newData.amount[i]+=x.amount[h]||0;
                newData.sum+=x.amount[h]||0;
            }
        })
        var amountDay2=dataDay2.filter(function(x){return k.route==x.route&&k.name==x.name;});
        amountDay2.forEach(function(x){
            for(var i = 16; i <= 23;i++){
                var h = i + 7 - 24;
                newData.amount[i]=newData.amount[i]||0;
                newData.amount[i]+=x.amount[h]||0;
                newData.sum+=x.amount[h]||0;
            }
        })
        newData.amount=newData.amount.map(function(y){return y&&Parser.round1(y)});
        newData.sum=Parser.round1(newData.sum);
        Combined.push(newData);
    });
    Combined.forEach(function(x){
        if(x.amount.find(function(y){return y!=0;})){
            viewRender.toShow.transfusion.push(x);
        }
    });
}
viewRender.flowSheet.parseFeeding=function(fieldOrigin,fieldTarget,flowSheetToday,flowSheetTommorrow){
    var dataDay1=flowSheetToday[fieldOrigin];
    var dataDay2=flowSheetTommorrow[fieldOrigin];
    var newData = [];
    var sum=0;
    for(var i = 0; i <= 16;i++){
        var h = i + 7;
        newData[i]=dataDay1[h];
        sum+=Number(dataDay1[h])||0;
    }
    for(var i = 16; i <= 23;i++){
        var h = i + 7 - 24;
        newData[i]=dataDay2[h];
        sum+=Number(dataDay2[h])||0;
    }
    if(fieldOrigin=="RVAmount"){sum=0;}
    var newObj={name:fieldTarget,amount:newData,sum:sum};
    newObj.amount=newObj.amount.map(function(y){return y&&Parser.round1(y)});
    newObj.sum=Parser.round1(newObj.sum);
    viewRender.toShow.feeding.push(newObj);
}
viewRender.flowSheet.parseExcretion=function(fieldOrigin,fieldTarget,flowSheetToday,flowSheetTommorrow){
    var dataDay1=flowSheetToday[fieldOrigin];
    var dataDay2=flowSheetTommorrow[fieldOrigin];
    
    var newData = [];
    var sum=0;
    for(var i = 0; i <= 16;i++){
        var h = i + 7;
        newData[i]=dataDay1[h];
        sum+=Number(dataDay1[h])||0;
    }
    for(var i = 16; i <= 23;i++){
        var h = i + 7 - 24;
        newData[i]=dataDay2[h];
        sum+=Number(dataDay2[h])||0;
    }
    if(fieldOrigin=="stool"){
        newData=newData.map(function(x){return x&&viewRender.flowSheet.translateStool(x)});
        sum=0;
    }else if(fieldOrigin=="enema"){
        sum=0;
    }
    var newObj={name:fieldTarget,amount:newData,sum:sum};
    newObj.amount=newObj.amount.map(function(y){return Number(y)||Parser.round1(y)||y});
    newObj.sum=Parser.round1(newObj.sum);
    viewRender.toShow.excretion.push(newObj);
}
viewRender.flowSheet.translateStool=function (stoolCode){
        var newSentence ="";
		for(var j=0; j < stoolCode.length;j++)
		{
			switch(stoolCode[j]) {
			case "a":newSentence+="成形<br>";break;
			case "b":newSentence+="腹瀉<br>";break;
			case "c":newSentence+="軟便<br>";break;
			case "d":newSentence+="水狀<br>";break;
			case "e":newSentence+="糊狀<br>";break;
			case "f":newSentence+="滲便<br>";break;
			case "g":newSentence+="血便<br>";break;
			case "h":newSentence+="硬便<br>";break;
			case "i":newSentence+="黏液<br>";break;
			case "j":newSentence+="顆粒<br>";break;
			case "k":newSentence+="胎便<br>";break;

			case "A":newSentence+="黑<br>";break;
			case "B":newSentence+="綠<br>";break;
			case "C":newSentence+="褐紫<br>";break;
			case "D":newSentence+="紅<br>";break;
			case "E":newSentence+="白<br>";break;
			case "F":newSentence+="黃<br>";break;	
			case "G":newSentence+="墨綠<br>";break;
			}
        } 
        return newSentence;
}
viewRender.flowSheet.parseDrain=function(flowSheetToday,flowSheetTommorrow){
    var dataDay1=flowSheetToday['drain'].filter(function(x){return x.amount.slice(7,24).find(function(y){return y;})});
    var dataDay2=flowSheetTommorrow['drain'].filter(function(x){return x.amount.slice(0,8).find(function(y){return y;})});
    var keys=[];
    dataDay1.forEach(function(x){viewRender.flowSheet.mergeDistinctKeys(x,keys);})
    dataDay2.forEach(function(x){viewRender.flowSheet.mergeDistinctKeys(x,keys);})
    var Combined=[];
    keys.forEach(function(k){
        var newData = {route:k.route,name:k.name,amount:[],sum:0};
        var amountDay1=dataDay1.filter(function(x){return k.route==x.route&&k.name==x.name;});
        amountDay1.forEach(function(x){
            for(var i = 0; i <= 16;i++){
                var h = i + 7;
                newData.amount[i]=newData.amount[i]||0;
                newData.amount[i]+=x.amount[h]||0;
                newData.sum+=x.amount[h]||0;
            }
        })
        var amountDay2=dataDay2.filter(function(x){return k.route==x.route&&k.name==x.name;});
        amountDay2.forEach(function(x){
            for(var i = 16; i <= 23;i++){
                var h = i + 7 - 24;
                newData.amount[i]=newData.amount[i]||0;
                newData.amount[i]+=x.amount[h]||0;
                newData.sum+=x.amount[h]||0;
            }
        })
        Combined.push(newData);
    });
    Combined.forEach(function(x){
        if(x.amount.find(function(y){return y!=0;})){
            x.amount=x.amount.map(function(y){return y&&Parser.round1(y)});
            x.sum=Parser.round1(x.sum);
            viewRender.toShow.drain.push(x);
        }
    });
}
viewRender.flowSheet.parseIO=function(flowSheetToday,flowSheetTommorrow,flowSheetDay2,flowSheetDay3){
    FS.io.morning.input=Math.round(this.sumInput(flowSheetToday,7,14))||"";
    FS.io.afternoon.input=Math.round(this.sumInput(flowSheetToday,15,22))||"";
    FS.io.night.input=Math.round(this.sumInput(flowSheetToday,23,23)+this.sumInput(flowSheetTommorrow,0,6))||"";
    FS.io.day1.input=Math.round(this.sumInput(flowSheetToday,7,23)+this.sumInput(flowSheetTommorrow,0,6))||"";
    FS.io.day1.daily=Math.round(FS.io.day1.input/flowSheetToday.bwSelect.bw)||"";

    FS.io.day2.input=Math.round(this.sumInput(flowSheetDay2,7,23)+this.sumInput(flowSheetToday,0,6))||"";
    FS.io.day2.daily=Math.round(FS.io.day2.input/flowSheetDay2.bwSelect.bw)||"";

    FS.io.day3.input=Math.round(this.sumInput(flowSheetDay3,7,23)+this.sumInput(flowSheetDay2,0,6))||"";
    FS.io.day3.daily=Math.round(FS.io.day3.input/flowSheetDay3.bwSelect.bw)||"";
    
    FS.io.morning.output=Math.round(this.sumOutput(flowSheetToday,7,14))||"";
    FS.io.afternoon.output=Math.round(this.sumOutput(flowSheetToday,15,22))||"";
    FS.io.night.output=Math.round(this.sumOutput(flowSheetToday,23,23)+this.sumOutput(flowSheetTommorrow,0,6))||"";
    FS.io.day1.output=Math.round(this.sumOutput(flowSheetToday,7,23)+this.sumOutput(flowSheetTommorrow,0,6))||"";
    FS.io.day2.output=Math.round(this.sumOutput(flowSheetDay2,7,23)+this.sumOutput(flowSheetToday,0,6))||"";
    FS.io.day3.output=Math.round(this.sumOutput(flowSheetDay3,7,23)+this.sumOutput(flowSheetDay2,0,6))||"";

    this.calculateIO(FS.io.morning);
    this.calculateIO(FS.io.afternoon);
    this.calculateIO(FS.io.night);
    this.calculateIO(FS.io.day1);
    this.calculateIO(FS.io.day2);
    this.calculateIO(FS.io.day3);

    FS.io.morning.urine=Math.round(this.sumUrine(flowSheetToday,7,14))||"";
    FS.io.afternoon.urine=Math.round(this.sumUrine(flowSheetToday,15,22))||"";
    FS.io.night.urine=Math.round(this.sumUrine(flowSheetToday,23,23)+this.sumUrine(flowSheetTommorrow,0,6))||"";
    FS.io.day1.urine=Math.round(this.sumUrine(flowSheetToday,7,23)+this.sumUrine(flowSheetTommorrow,0,6))||"";
    FS.io.day2.urine=Math.round(this.sumUrine(flowSheetDay2,7,23)+this.sumUrine(flowSheetToday,0,6))||"";
    FS.io.day3.urine=Math.round(this.sumUrine(flowSheetDay3,7,23)+this.sumUrine(flowSheetDay2,0,6))||"";

    FS.io.morning.urinePerKgHr="";
    if(FS.io.morning.urine){
        FS.io.morning.urinePerKgHr=Parser.round1(FS.io.morning.urine/this.getAvailableHr(flowSheetToday,7,14)/flowSheetToday.bwSelect.bw)||""
    }
    FS.io.afternoon.urinePerKgHr="";
    if(FS.io.afternoon.urine){
        FS.io.afternoon.urinePerKgHr=Parser.round1(FS.io.afternoon.urine/this.getAvailableHr(flowSheetToday,15,22)/flowSheetToday.bwSelect.bw)||""
    }
    FS.io.night.urinePerKgHr="";
    if(FS.io.night.urine){
        FS.io.night.urinePerKgHr=Parser.round1(FS.io.night.urine/(this.getAvailableHr(flowSheetToday,23,23)+this.getAvailableHr(flowSheetTommorrow,0,6))/flowSheetToday.bwSelect.bw)||""
    }
    FS.io.day1.urinePerKgHr="";
    if(FS.io.day1.urine){
        FS.io.day1.urinePerKgHr=Parser.round1(FS.io.day1.urine/(this.getAvailableHr(flowSheetToday,7,23)+this.getAvailableHr(flowSheetTommorrow,0,6))/flowSheetToday.bwSelect.bw)||""
    }
    FS.io.day2.urinePerKgHr="";
    if(FS.io.day2.urine){
        FS.io.day2.urinePerKgHr=Parser.round1(FS.io.day2.urine/(this.getAvailableHr(flowSheetDay2,7,23)+this.getAvailableHr(flowSheetToday,0,6))/flowSheetDay2.bwSelect.bw)||""
    }
    FS.io.day3.urinePerKgHr="";
    if(FS.io.day3.urine){
        FS.io.day3.urinePerKgHr=Parser.round1(FS.io.day3.urine/(this.getAvailableHr(flowSheetDay3,7,23)+this.getAvailableHr(flowSheetDay2,0,6))/flowSheetDay3.bwSelect.bw)||""
    }
    this.urinePerKgHrWarn(FS.io.morning);
    this.urinePerKgHrWarn(FS.io.afternoon);
    this.urinePerKgHrWarn(FS.io.night);
    this.urinePerKgHrWarn(FS.io.day1);
    this.urinePerKgHrWarn(FS.io.day2);
    this.urinePerKgHrWarn(FS.io.day3);
    
}
viewRender.flowSheet.sumInput=function(flowSheet,start,end){
    var sum=0;
    flowSheet.peripheral.forEach(function(x){sum+=d3.sum(x.amount.slice(start,end+1))});
    flowSheet.central.forEach(function(x){sum+=d3.sum(x.amount.slice(start,end+1))});
    flowSheet.aline.forEach(function(x){sum+=d3.sum(x.amount.slice(start,end+1))});
    flowSheet.transfusion.forEach(function(x){sum+=d3.sum(x.amount.slice(start,end+1))});
    sum+=d3.sum(flowSheet.POAmount.slice(start,end+1));
    sum+=d3.sum(flowSheet.NGAmount.slice(start,end+1));
    return sum;
}
viewRender.flowSheet.sumOutput=function(flowSheet,start,end){
    var sum=0;
    flowSheet.drain.forEach(function(x){sum+=d3.sum(x.amount.slice(start,end+1))});
    sum+=d3.sum(flowSheet.NGDrain.slice(start,end+1));
    sum+=d3.sum(flowSheet.urine.slice(start,end+1));
    return sum;
}
viewRender.flowSheet.sumUrine=function(flowSheet,start,end){
    var sum=0;
    sum+=d3.sum(flowSheet.urine.slice(start,end+1));
    return sum;
}
viewRender.flowSheet.getAvailableHr=function(flowSheet,start,end){
    var minIndex=start;var maxIndex=end;
    if(flowSheet.date==FS.dischargeDate||flowSheet.date==Parser.getDate()||flowSheet.date==FS.admissionDate)
    {
        minIndex=23;var maxIndex=0;
        var fieldlist=['heartRate','bodyTemperature','respiratoryRate','saturation','sbp','dbp'];
        for(var i = 0; i < fieldlist.length;i++){
            var hrs = flowSheet[fieldlist[i]].map(function(x){return Number(x.time.split(':')[0]);});
            minIndex=Math.min(minIndex,d3.min(hrs)||23);
            maxIndex=Math.max(maxIndex,d3.max(hrs)||0);
            if(minIndex==0&&maxIndex==23){
                break;
            }
        }
        if(maxIndex<minIndex){ return 0};
        return Math.min(end,maxIndex)-Math.max(start,minIndex)+1;
    }else if(Parser.getDateFromString(flowSheet.date)<=Parser.getDateFromString(FS.dischargeDate||Parser.getDate())
    &&Parser.getDateFromString(flowSheet.date)>=Parser.getDateFromString(FS.admissionDate||Parser.getDate())){
        return end-start+1;
    }
    return 0;
}
viewRender.flowSheet.urinePerKgHrWarn=function(shift){
    var urinePerKgHr=shift.urinePerKgHr;
    if(urinePerKgHr&&urinePerKgHr<1){
        shift.warn=true;
    }else if(urinePerKgHr&&urinePerKgHr>=5){
        shift.warn=true;
    }else{
        shift.warn=false;
    };
}
viewRender.flowSheet.calculateIO=function(x){
    x.io=x.input-x.output;
    if(x.io>0){x.io="+"+x.io;}
    else if(!x.input&&!x.output){x.io="";}
}
viewRender.flowSheet.parseEvent=function(flowSheets){
    var toShow=viewRender.toShow;
    flowSheets.forEach(function(x){
        var date= x.date;
        x.event.forEach(function(y){
            var time=y.time;
            var compareString=String(y.content).toLowerCase();

            if(compareString.slice(0,2)=='@v'||compareString.slice(0,3)==('@ v')){
                if(compareString.slice(0,2)=='@v'){
                    compareString=y.content.slice(2)
                }else{
                    compareString=y.content.slice(3)
                }
                var selectedDate = toShow.ventilatorSetting.find(function(x){return x.date==date;});
                var parsed=Parser.ventilationSettingFromEvent(compareString);
                var dataToPush={time:time,class:'setting',str:parsed.setting, mode:parsed.mode};
                if(selectedDate){
                    selectedDate.data.push(dataToPush);
                }else{
                    var newDateObj={date:date,data:[dataToPush]};
                    toShow.ventilatorSetting.push(newDateObj);
                }
            }else{
                var dataToPush={date:x.date,time:time,str:y.content};
                toShow.events.push(dataToPush);
            }
        });
    });
}


//將abg資料push進入toShow
viewRender.abg={};
viewRender.abg.selectDate=function(date){
    var toShow=viewRender.toShow;
    toShow.abg=[];
    var gas = FS.gas;
    var Index_DateTime=gas.colNames.indexOf('日期');
    var Index_ph=gas.colNames.indexOf('PH');
    var Index_po2=gas.colNames.indexOf('PO2');
    var Index_pco2=gas.colNames.indexOf('PCO2');
    var Index_hco3=gas.colNames.indexOf('HCO3');
    var Index_be=gas.colNames.indexOf('BE');
    var Index_sat=gas.colNames.indexOf('O2SAT');
    
    var startDateTime=Parser.getDateFromString(Parser.addDate(date,-2));
    var endDateTime=Parser.getDateFromString(Parser.addDate(date,1));
    endDateTime=endDateTime.setTime(endDateTime.getTime()+(7*60*60*1000));
    var selectedData = gas.data.filter(function(x){
        var dt = Parser.getDateFromString(x[Index_DateTime]);
        return dt>=startDateTime && dt < endDateTime;
    });
    
    selectedData.forEach(function(x){
        var parts=x[Index_DateTime].split(' ');
        var date= parts[0];
        var time=parts[1];
        var selectedDate = toShow.abg.find(function(x){return x.date==date;});
        var dataToPush={time:time,class:'gas',pH:(x[Index_ph]&&Parser.round2(x[Index_ph]))||"",pCO2:x[Index_pco2],HCO3:x[Index_hco3],BE:x[Index_be],pO2:x[Index_po2]&&Math.round(x[Index_po2]),Sat:(x[Index_sat]&&Math.round(x[Index_sat])+span('%',['s-word']))};
        if(selectedDate){
            selectedDate.data.push(dataToPush);
        }else{
            var newDateObj={date:date,data:[dataToPush]};
            toShow.abg.push(newDateObj);
        }
    });
}

viewRender.toShow={  //empty container 
    bt:{limit:[],data:[]},
    hr:{limit:[],data:[]},
    resp:{limit:[],resp:[]},
    spo2:{limit:[],data:[]},
    sbp:{limit:[],data:[]},
    dbp:{limit:[],data:[]},
    mbp:{limit:[],data:[]},
    infusion:[],
    transfusion:[],
    feeding:[],
    excretion:[],
    drain:[],
    ventilatorSetting:[],
    abg:[],
    ventilation:[],
    events:[]
};

//chart: 將toShoW資料更新至view的Chart+IO
viewRender.chart = {
    initialize:function(){
        var toShow=viewRender.toShow;
        var chartArray =[];
        var TPRTable={
            classes:['tpr'],
            rows:[this.header(),
                this.tprRow("體溫","(&#8451;)",toShow.bt.limit,toShow.bt.data),
                this.tprRow("心律","(/min)",toShow.hr.limit,toShow.hr.data),
                this.tprRow("呼吸","(/min)",toShow.resp.limit,toShow.resp.data),
                this.tprRow("SpO<sub>2</sub>","(/min)",toShow.spo2.limit,toShow.spo2.data),
                this.spacerRow(),
                this.tprRow("SBP","(mmHg)",toShow.sbp.limit,toShow.sbp.data),
                this.tprRow("DBP","(mmHg)",toShow.dbp.limit,toShow.dbp.data),
                this.tprRow("MBP","(mmHg)",toShow.mbp.limit,toShow.mbp.data)
            ]
        };
        chartArray.push(TPRTable);

        var InfusionTable={
            classes:['infusion'],
            rows:[]
        };
        if(toShow.infusion.length==0){
            toShow.infusion=[{route:"IV"}] //no infusion;
        };
        toShow.infusion.forEach(function(x){
            InfusionTable.rows.push(
                viewRender.chart.row(x.route||"","(ml)",x.name||"",(x.amount||[]).map(
                    function(y,index){
                        var delta=x.delta[index];
                        if(delta==1){
                            var result=div(span("&#9652;",['up'])+y,['td-data','arial']);
                        }else if(delta==-1){
                            var result=div(span("&#9662;",['down'])+y,['td-data','arial']);
                        }else{
                            var result=div(y,['td-data','arial']);
                        }
                        return y&&result;
                    }
                ),x.sum)
            );
        });
        chartArray.push(InfusionTable);

        var transfusionTable={
            classes:['transfusion'],
            rows:[]
        };
        toShow.transfusion.forEach(function(x){
            transfusionTable.rows.push(
                viewRender.chart.row(x.route||"","(ml)",x.name||"",(x.amount||[]).map(function(y,index){return y&&div(y,['td-data','arial']);}),x.sum)
            );
        });
        transfusionTable.rows&&chartArray.push(transfusionTable);
        
        var feedingTable={
            classes:['feeding'],
            rows:[]
        };
        toShow.feeding.forEach(function(x){
            feedingTable.rows.push(
                viewRender.chart.row(x.name||"","(ml)","",(x.amount||[]).map(function(x){return x===0?div(0,['td-data','arial']):(x&&div(x,['td-data','arial']));}),x.sum)
            );
        });
        chartArray.push(feedingTable);
    
        var excretionTable={
            classes:['excretion'],
            rows:[]
        };
        toShow.excretion.forEach(function(x){
            excretionTable.rows.push(
                viewRender.chart.row(x.name||"",x.unit||"(ml)","",(x.amount||[]).map(function(x){return x===0?div(0,['td-data','arial']):(x&&div(x,['td-data','arial']));}),x.sum)
            );
        });
        chartArray.push(excretionTable);
    
        var drainTable={
            classes:['drain'],
            rows:[]
        };
        toShow.drain.forEach(function(x){
            drainTable.rows.push(
                viewRender.chart.row(x.route||"","(ml)",x.name||"",(x.amount||[]).map(function(x){return x&&div(x,['td-data','arial']);}),x.sum)
            );
        });
        drainTable.rows&&chartArray.push(drainTable);

        view.flowSheet.chart=chartArray;
    },
    header:function(){
        var resultArray=[];
            resultArray.push(new cell("時間",'title-color'));
            for(var i = 7; i < 24; i++){
                resultArray.push(new cell(i,'header-color'));
            }
            for(var i = 0; i < 7; i++){
                resultArray.push(new cell(i,'header-color'));
            }
        return resultArray;
    },
    tprRow:function(title,unit,limit,data){
        var resultArray=[];
        data=data||[];
        limit=limit||[];
        var lowerLimit=limit[0];
        var upperLimit=limit[1];
        var limitString="";
        if(lowerLimit&&upperLimit){
            limitString=lowerLimit+"-"+upperLimit;
        }else if (lowerLimit){
            limitString="&ge;"+lowerLimit;
        }else if(upperLimit){
            limitString="&lt;"+upperLimit;
        }
        var titleString=span(title,["title"])+" "+span(unit,["unit"])+" "+span(limitString,["limit"]);
        resultArray.push(new cell(titleString,'title-color')); 
        for(var i = 0; i < 24;i++)
        {
            if(data[i]){
                resultArray.push(new cell(data[i].htmlText||data[i],'data-color',data[i].tooltip||""))
            }else
            {   
                resultArray.push(new cell("",'no-data-color'))
            }
        }
        return resultArray;
    },
    row:function(title,unit,content,data,sum){
        var resultArray=[];
        data=data||[];
        var titleString=span(title,["title"])+" "+(sum?span(sum,["sum"]):span(unit,["unit"]))+" "+span(content,["content"]);
        resultArray.push(new cell(titleString,'title-color')); 
        for(var i = 0; i < 24;i++)
        {
            if(data[i]){
                resultArray.push(new cell(data[i],'data-color'))
            }else
            {   
                resultArray.push(new cell("",'no-data-color'))
            }
        }
        return resultArray;
    },
    spacerRow:function(){
        return [new cell("","spacer")];
    }
};

//chart: 將toShoW資料更新至view的ventilation
viewRender.ventilation={
    initialize:function(){
        var toShow=viewRender.toShow;
        var ventilation=toShow.ventilation=[];
        var abg=toShow.abg;
        var setting=toShow.ventilatorSetting;
        abg.forEach(function(x){ventilation.push(x);});
        setting.forEach(function(x){
            var matchDate=ventilation.find(function(y){return x.date==y.date;})
            if(matchDate){
                x.data.forEach(function(y){matchDate.data.push(y)});
            }
            else{
                ventilation.push(x);
            }
        })
        
        toShow.ventilation=ventilation.sort(function(a,b){return String(a.date).localeCompare(b.date);});

        view.flowSheet.ventilation="";
        toShow.ventilation.forEach(function(v){
            view.flowSheet.ventilation+=viewRender.ventilation.getDateComponentString(v.date);
            view.flowSheet.ventilation+=viewRender.ventilation.getGasTitleComponentString();
            v.data=v.data.sort(function(a,b){return String(a.time).localeCompare(b.time);})
            v.data.forEach(function(d){
                if(d.class=="setting"){
                    var append=viewRender.ventilation.getSettingComponentString(d);
                }else if(d.class=="gas"){
                    var append=viewRender.ventilation.getGasComponentString(d);
                }
                view.flowSheet.ventilation+=append;
            })
        });
    },
    getDateComponentString:function(date){
        return '<div class="day-card w1-1 h-center s-word"><div class="v-center">'+Parser.getMMDD(date)+'</div></div>'
    },
    getGasTitleComponentString:function(){
        return '<div class="gas-card-title w1-1 nowrap">'+
        '<div class="w1-7 h1-1 s-word float-left"></div>'+
        '<div class="w1-7 h1-1 float-left"><div class="upper xs-word v-center">pH</div></div>'+
        '<div class="w1-7 h1-1 float-left"><div class="upper xs-word v-center">pCO<sub>2</sub></div></div>'+
        '<div class="w1-7 h1-1 float-left"><div class="upper xs-word v-center">HCO<sub>3</sub></div></div>'+
        '<div class="w1-7 h1-1 float-left"><div class="upper xs-word v-center">BE</div></div>'+
        '<div class="w1-7 h1-1 float-left"><div class="upper xs-word v-center">pO<sub>2</sub></div></div>'+
        '<div class="w1-7 h1-1 float-left"><div class="upper xs-word v-center">Sat</div></div>'+
        '</div>';
    },
    getSettingComponentString:function(d){
        var append ='<div class="vent-card w1-1 nowrap">';
        append+='<div class="w1-7 h1-1 s-word grey-20-font float-left"><div class="v-center">'+d.time+'</div></div>'
        append+='<div class="w6-7 h1-1 float-left">';
        append+='<div class="w1-6 h1-1 float-left"><div class="v-center s-word heavy-weight wrap">'+(d.mode||"")+'</div></div>';
        append+='<div class="w5-6 h1-1 float-left"><div class="v-center xs-word wrap">'+(d.str||"")+'</div></div>';
        append+='</div></div>'
        return append;
    },
    getGasComponentString:function(d){
        var append= '<div class="gas-card w1-1 nowrap">';
        append+='<div class="w1-7 h1-1 s-word grey-20-font float-left"><div class="v-center">'+d.time+'</div></div>'
        append+='<div class="w6-7 h1-1 float-left">';
        if(d.pH>=7.5||d.pH<7.25){
            append+='<div class="w1-6 h1-1 float-left warn"><div class="v-center ms-word heavy-weight">'+d.pH+'</div></div>';
        }else{
            append+='<div class="w1-6 h1-1 float-left"><div class="v-center ms-word heavy-weight">'+d.pH+'</div></div>';
        }
        if(d.pCO2>=50||d.pCO2<35){
            append+='<div class="w1-6 h1-1 float-left warn"><div class="v-center ms-word heavy-weight">'+d.pCO2+'</div></div>';
        }else{
            append+='<div class="w1-6 h1-1 float-left"><div class="v-center ms-word heavy-weight">'+d.pCO2+'</div></div>';
        }
        if(d.HCO3>=30||d.HCO3<16){
            append+='<div class="w1-6 h1-1 float-left warn"><div class="v-center ms-word heavy-weight">'+d.HCO3+'</div></div>';
        }else{
            append+='<div class="w1-6 h1-1 float-left"><div class="v-center ms-word heavy-weight">'+d.HCO3+'</div></div>';
        }
        if(d.BE>=10||d.BE<-8){
            append+='<div class="w1-6 h1-1 float-left warn"><div class="v-center ms-word heavy-weight">'+d.BE+'</div></div>';
        }else{
            append+='<div class="w1-6 h1-1 float-left"><div class="v-center ms-word heavy-weight">'+d.BE+'</div></div>';
        }
        if(d.pO2){
            append+='<div class="w1-6 h1-1 float-left"><div class="v-center ms-word heavy-weight">'+d.pO2+'</div></div>';
        }
        if(d.Sat){
            append+='<div class="w1-6 h1-1 float-left"><div class="v-center ms-word heavy-weight">'+d.Sat+'</div></div>';
        }
        append+='</div></div>';
        return append;
    }
}
viewRender.event={
    initialize:function(){
        var toShow=viewRender.toShow;
        toShow.events=toShow.events.sort(function(a,b){
            if(a.date==b.date){
                return a.time.localeCompare(b.time);
            }
            return a.date.localeCompare(b.date);
        })
        FS.event=toShow.events.map(function(x){
            var dateTime = Parser.getMMDD(x.date)+" "+x.time;
            return {dateTime:dateTime, content:x.str };
        });
    }
}
viewRender.closeAll=function(){
    FS.showDatePicker=false;
    FS.showAdPicker=false;
    FS.showBW=false;
}
viewRender.jquery=function(){
    if(view.flowSheet.footbarStatus=="min"){
        Layout.footbar.min();
    }else if(view.flowSheet.footbarStatus=="max"){
        Layout.footbar.max();
    }else{
        Layout.footbar.close();
    };
    $('.scrollbar-inner').scrollbar();
    $('.scrollbar-outer').scrollbar();
    $(window).off("click").on("click",function(){
        viewRender.closeAll();
    });
    $('#date').off().on("click",function(){
        var status=!FS.showDatePicker;
        viewRender.closeAll();
        FS.showDatePicker = status;
        return false;
    });
    $('#datepicker').off().on('click',function(){
        return false;
    });

    $('#datepicker').datepicker({
        onSelect: function(date) {
            viewRender.queryDate(FS.patientID,FS.caseNo,date);
            FS.showDatePicker=false;
        },
        dateFormat: 'yy-mm-dd'
    });
    $('#datepicker').datepicker('option', 'minDate', Parser.getDateFromString(FS.admissionDate||FS.birthDate));
    $('#datepicker').datepicker('option', 'maxDate', Parser.getDateFromString(FS.dischargeDate||Parser.getDate()));
    $('#datepicker').datepicker('setDate', Parser.getDateFromString(FS.currentDate||""));
    //header DOMs..
    setTimeout(function() {
        Layout.onWidthChange();
        $('.header-card').off();
        $('#admission-card').on("click",function(){
            var status=!FS.showAdPicker;
            viewRender.closeAll();
            FS.showAdPicker = status;
            return false;
        });
        $('#adpicker').on('click',function(){
            return false;
        });
        $('#bw-card').on("click",function(){
            var status=!FS.showBW;
            viewRender.closeAll();
            FS.inputBW="";
            FS.showBW = status;
            Vue.nextTick(function(){
               $('#bw input').focus();
            });
            return false;
        });
        $('#bw').off().on('click',function(){
            return false;
        });
    }, 0);
};

viewRender.selectDate=function(date){
    viewRender.toShow={};
    viewRender.flowSheet.selectDate(date);
    viewRender.abg.selectDate(date);
    viewRender.initialize();
}

viewRender.initialize=function(){
    viewRender.bw.initialize();
    viewRender.chart.initialize();
    viewRender.header.initialize();
    viewRender.ventilation.initialize();
    viewRender.event.initialize();
    Vue.nextTick(function(){
        viewRender.jquery();
    });
}

viewRender.queryPatientData=function(patientID){
    FS.patientID=patientID;
    FS.footbarStatus="min";
    FS.selectedfootbarMenu="fnOverview";
    var promisePatientData=function(){
        return new Promise(function(resolve,reject){
            requestPatientData(patientID,function(data,timeStamp){
                FS.bed=data&&data.currentBed;
                FS.name=data&&data.patientName;
                FS.birthday=data&&data.birthDate;
                FS.vs=data&&data.visitingStaff&&data.visitingStaff.name;
                var findBW=bwHolder.find(function(x){return x.patientID==patientID;});
                FS.bwForCalculate=(findBW&&findBW.bw)||"";
                resolve();
            });
        })
    };
    var promiseAdmissionList=function(){
        return new Promise(function(resolve,reject){
            requestAdmissionList(patientID,function(data,timeStamp){
                FS.admissionList = data.filter(function(x){return x.section!="SER"&&x.section!="PER";});
                    resolve();
                
            });
        })
    };
    var promiseBirthSheet=function(){
        return new Promise(function(resolve,reject){
            if(FS.admissionList){
                var admission=FS.admissionList[0];
                var caseNo=admission.caseNo;
                FS.caseNo=caseNo;
                var firstCaseNo=FS.admissionList.slice(-1)[0].caseNo;
                updateBirthSheet(patientID,firstCaseNo,function(data,timeStamp){
                    FS.birthSheet=data||{};
                    FS.GAweek="";
                    FS.GAday="";
                    if(FS.birthSheet.hasBirthSheet){
                        FS.birthSheet=data;
                        FS.GAweek=FS.birthSheet.child.GAweek;
                        FS.GAday=FS.birthSheet.child.GAday;
                    }
                    resolve();
                })
            }
        })
    };
    var promiseCummulative=function(field,FSfield){
        return new Promise(function(resolve,reject){ 
            requestCummulative(patientID,240,field,function(data,timeStamp){ //months=240(20y)
                FS[FSfield]=data;
                resolve();
            });
        })
    };

    var promise=promisePatientData()
        .then(function(){return promiseAdmissionList()})
        .then(function(){return promiseCummulative('DCHEM','smac')})
        .then(function(){return promiseCummulative('DCBC','cbc')})
        .then(function(){return promiseCummulative('DGLU1','bs')})
        .then(function(){return promiseCummulative('DBGAS','gas')})
        .then(function(){return promiseBirthSheet()})
        .then(function(){viewRender.queryCaseNo(patientID, FS.caseNo);})
};

viewRender.queryCaseNo=function(patientID, caseNo){
    var admission = FS.admissionList.filter(function(x){return x.caseNo==caseNo;})
    if(admission&&admission[0]){
        admission=admission[0];
        FS.caseNo=caseNo;
        FS.admissionDate=admission.admissionDate;
        FS.dischargeDate=admission.dischargeDate;
        var qdate = FS.dischargeDate||Parser.getDate();

        var promiseVitalSign=function(){
            return new Promise(function(resolve,reject){
                requestVitalSign(patientID, caseNo, "HWS",function(data,timeStamp){  //caseNo="all"可查詢全部資料
                    if(FS.admissionList.slice(-1)[0].section=="NB"){
                        requestVitalSign(patientID, FS.admissionList.slice(-1)[0].caseNo, "HWS",function(firstAddata,timeStamp){
                            data.data=data.data.concat(firstAddata.data);
                            viewRender.bw.initialize(data);
                            resolve();
                        });
                    }else{
                        viewRender.bw.initialize(data);
                        resolve();
                    }
                });
            });
        }

        var promise = promiseVitalSign()
            .then(function(){
                viewRender.queryDate(patientID,caseNo,qdate);
            });
    };
}

viewRender.queryDate=function(patientID,caseNo,date){
    var getFlowSheetByDate=function(date){
        return new Promise(function(resolve, reject){
            requestFlowSheet(patientID,caseNo, Parser.getShortDate(date),function(data,timeStamp){
                dataContainer.push({date:date,flowSheet:data});
                resolve();
            }); 
        });
    }
    
    FS.currentDate=date;
    var dataContainer=[];
    var queryDateList=[];
    queryDateList.push(date);
    queryDateList.push(Parser.addDate(date,1));
    queryDateList.push(Parser.addDate(date,-1));
    queryDateList.push(Parser.addDate(date,-2));

    var promise = getFlowSheetByDate(queryDateList[0])
        .then(function(){
            return getFlowSheetByDate(queryDateList[1]);
        }).then(function(){
            return getFlowSheetByDate(queryDateList[2]);
        }).then(function(){
            return getFlowSheetByDate(queryDateList[3]);
        }).then(function(){
            viewRender.flowSheet.dataContainer=dataContainer;
            viewRender.selectDate(date);
            $('#datepicker').datepicker("setDate", FS.currentDate);
        });
}


