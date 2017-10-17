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
    parsedbw.sort(function(a,b){return new Date(a.dateTime)-new Date(b.dateTime)});
    
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

    var yesterday = new Date(FS.currentDate);
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
viewRender.header={
    initialize:function(){
        var headerCards=[];
        FS.weekDay=Parser.getDayString(new Date(FS.currentDate).getDay());
        FS.dayDifference= Parser.getDayDifferenceString(FS.currentDate);
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

viewRender.flowSheet={};
viewRender.flowSheet.dataContainer=[];
viewRender.flowSheet.selectDate=function(date){
    viewRender.flowSheet.toShow={  //清空資料 設定初始
        bt:{limit:[36,38],data:[]},
        hr:{limit:[100,180],data:[]},
        resp:{limit:[30,60],resp:[]},
        spo2:{limit:[85],data:[]},
        sbp:{limit:[60],data:[]},
        dbp:{limit:[20],data:[]},
        mbp:{limit:[30],data:[]},
        infusion:[],
        transfusion:[],
        feeding:[],
        excretion:[],
        drain:[]
    };
    var dataContainer=viewRender.flowSheet.dataContainer;
    console.log(dataContainer);
    var flowSheetToday=dataContainer.find(function(x){return x.date==date}).flowSheet;
    var flowSheetTommorrow=dataContainer.find(function(x){return x.date==Parser.addDate(date,1);}).flowSheet;
    viewRender.flowSheet.calculateMBP(flowSheetToday);
    viewRender.flowSheet.calculateMBP(flowSheetTommorrow);
    viewRender.flowSheet.parseChart('bodyTemperature','bt',flowSheetToday,flowSheetTommorrow,{underLimitStyle:['blue','blue-bg','heavy-weight']});
    viewRender.flowSheet.parseChart('heartRate','hr',flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseChart('respiratoryRate','resp',flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseChart('saturation','spo2',flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseChart('sbp','sbp',flowSheetToday,flowSheetTommorrow);
    viewRender.flowSheet.parseChart('dbp','dbp',flowSheetToday,flowSheetTommorrow);
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
    viewRender.initialize();
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
    var limit = viewRender.flowSheet.toShow[fieldTarget].limit||[];
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
            
            parsed[index]=min+max;
        }
        
    })
    viewRender.flowSheet.toShow[fieldTarget].data=parsed;
};
viewRender.flowSheet.parseInfusion=function(fieldOrigin,flowSheetToday,flowSheetTommorrow,option){
    var dataDay1=flowSheetToday[fieldOrigin].filter(function(x){return x.amount.slice(7,24).find(function(y){return y;})});
    var dataDay2=flowSheetTommorrow[fieldOrigin].filter(function(x){return x.amount.slice(0,8).find(function(y){return y;})});
    var keys=[];
    dataDay1.forEach(function(x){viewRender.flowSheet.mergeDistinctKeys(x,keys);})
    dataDay2.forEach(function(x){viewRender.flowSheet.mergeDistinctKeys(x,keys);})
    var Combined=[];
    keys.forEach(function(k){
        var newData = {route:k.route,name:k.name,amount:[],priority:0,sum:0};
        if(fieldOrigin=="peripheral"){newData.priority=1;}
        else if(fieldOrigin=="aline"){newData.priority=2;}
        else if(fieldOrigin=="central"){newData.priority=3;}
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
            viewRender.flowSheet.toShow.infusion.push(x);
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
    viewRender.flowSheet.toShow.infusion=viewRender.flowSheet.toShow.infusion.sort(function(x,y){ 
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
        var newData = {route:k.route,name:k.name,amount:[]};
        var amountDay1=dataDay1.filter(function(x){return k.route==x.route&&k.name==x.name;});
        amountDay1.forEach(function(x){
            for(var i = 0; i <= 16;i++){
                var h = i + 7;
                newData.amount[i]=newData.amount[i]||0;
                newData.amount[i]+=x.amount[h]||0;
            }
        })
        var amountDay2=dataDay2.filter(function(x){return k.route==x.route&&k.name==x.name;});
        amountDay2.forEach(function(x){
            for(var i = 16; i <= 23;i++){
                var h = i + 7 - 24;
                newData.amount[i]=newData.amount[i]||0;
                newData.amount[i]+=x.amount[h]||0;
            }
        })
        newData.amount=newData.amount.map(function(y){return y&&Parser.round1(y)});
        Combined.push(newData);
    });
    Combined.forEach(function(x){
        if(x.amount.find(function(y){return y!=0;})){
            viewRender.flowSheet.toShow.transfusion.push(x);
        }
    });
}
viewRender.flowSheet.parseFeeding=function(fieldOrigin,fieldTarget,flowSheetToday,flowSheetTommorrow){
    var dataDay1=flowSheetToday[fieldOrigin];
    var dataDay2=flowSheetTommorrow[fieldOrigin];
    var newData = [];
    for(var i = 0; i <= 16;i++){
        var h = i + 7;
        newData[i]=dataDay1[h];
    }
    for(var i = 16; i <= 23;i++){
        var h = i + 7 - 24;
        newData[i]=dataDay2[h];
    }
    var newObj={name:fieldTarget,amount:newData};
    newObj.amount=newObj.amount.map(function(y){return y&&Parser.round1(y)});
    viewRender.flowSheet.toShow.feeding.push(newObj);
}
viewRender.flowSheet.parseExcretion=function(fieldOrigin,fieldTarget,flowSheetToday,flowSheetTommorrow){
    var dataDay1=flowSheetToday[fieldOrigin];
    var dataDay2=flowSheetTommorrow[fieldOrigin];
    var newData = [];
    for(var i = 0; i <= 16;i++){
        var h = i + 7;
        newData[i]=dataDay1[h];
    }
    for(var i = 16; i <= 23;i++){
        var h = i + 7 - 24;
        newData[i]=dataDay2[h];
    }
    if(fieldOrigin=="stool"){
        newData=newData.map(function(x){return x&&viewRender.flowSheet.translateStool(x)});
    }
    var newObj={name:fieldTarget,amount:newData};
    newObj.amount=newObj.amount.map(function(y){return y&&Parser.round1(y)});
    viewRender.flowSheet.toShow.excretion.push(newObj);
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
    console.log(keys);
    keys.forEach(function(k){
        var newData = {route:k.route,name:k.name,amount:[]};
        var amountDay1=dataDay1.filter(function(x){return k.route==x.route&&k.name==x.name;});
        amountDay1.forEach(function(x){
            for(var i = 0; i <= 16;i++){
                var h = i + 7;
                newData.amount[i]=newData.amount[i]||0;
                newData.amount[i]+=x.amount[h]||0;
            }
        })
        var amountDay2=dataDay2.filter(function(x){return k.route==x.route&&k.name==x.name;});
        amountDay2.forEach(function(x){
            for(var i = 16; i <= 23;i++){
                var h = i + 7 - 24;
                newData.amount[i]=newData.amount[i]||0;
                newData.amount[i]+=x.amount[h]||0;
            }
        })
        Combined.push(newData);
    });
    Combined.forEach(function(x){
        if(x.amount.find(function(y){return y!=0;})){
            x.amount=x.amount.map(function(y){return y&&Parser.round1(y)});
            viewRender.flowSheet.toShow.drain.push(x);
        }
    });
}
viewRender.flowSheet.toShow={  //empty container 
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
    drain:[]
};

viewRender.chart = {
    initialize:function(){
        var toShow=viewRender.flowSheet.toShow;
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
                viewRender.chart.row(x.route||"","(ml)",x.name||"",(x.amount||[]).map(function(x){return x&&div(x,['td-data','arial']);}))
            );
        });
        chartArray.push(InfusionTable);

        var transfusionTable={
            classes:['transfusion'],
            rows:[]
        };
        toShow.transfusion.forEach(function(x){
            transfusionTable.rows.push(
                viewRender.chart.row(x.route||"","(ml)",x.name||"",(x.amount||[]).map(function(x){return x&&div(x,['td-data','arial']);}))
            );
        });
        transfusionTable.rows&&chartArray.push(transfusionTable);
        
        var feedingTable={
            classes:['feeding'],
            rows:[]
        };
        toShow.feeding.forEach(function(x){
            feedingTable.rows.push(
                viewRender.chart.row(x.name||"","(ml)","",(x.amount||[]).map(function(x){return x===0?div(0,['td-data','arial']):(x&&div(x,['td-data','arial']));}))
            );
        });
        chartArray.push(feedingTable);
    
        var excretionTable={
            classes:['excretion'],
            rows:[]
        };
        toShow.excretion.forEach(function(x){
            excretionTable.rows.push(
                viewRender.chart.row(x.name||"",x.unit||"(ml)","",(x.amount||[]).map(function(x){return x===0?div(0,['td-data','arial']):(x&&div(x,['td-data','arial']));}))
            );
        });
        chartArray.push(excretionTable);
    
        var drainTable={
            classes:['drain'],
            rows:[]
        };
        toShow.drain.forEach(function(x){
            drainTable.rows.push(
                viewRender.chart.row(x.route||"","(ml)",x.name||"",(x.amount||[]).map(function(x){return x&&div(x,['td-data','arial']);}))
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
    row:function(title,unit,content,data){
        var resultArray=[];
        data=data||[];
        var titleString=span(title,["title"])+" "+span(unit,["unit"])+" "+span(content,["content"]);
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
    },
};
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
    $('#datepicker').datepicker('option', 'minDate', new Date(FS.admissionDate||FS.birthDate));
    $('#datepicker').datepicker('option', 'maxDate', new Date(FS.dischargeDate||Parser.getDate()));
    $('#datepicker').datepicker('setDate', new Date(FS.currentDate||""));
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

viewRender.initialize=function(){
    viewRender.bw.initialize();
    viewRender.chart.initialize();
    viewRender.header.initialize();
    Vue.nextTick(function(){
        viewRender.jquery();
    });
}

viewRender.queryPatientData=function(patientID){
    FS.patientID=patientID;
    FS.footbarStatus="min";
    FS.selectedfootbarMenu="fnOverview";
    requestPatientData(patientID,function(data,timeStamp){
        FS.bed=data&&data.currentBed;
        FS.name=data&&data.patientName;
        FS.birthday=data&&data.birthDate;
        FS.vs=data&&data.visitingStaff&&data.visitingStaff.name;
        var findBW=bwHolder.find(function(x){return x.patientID==patientID;});
        FS.bwForCalculate=(findBW&&findBW.bw)||"";
        requestAdmissionList(patientID,function(data,timeStamp){
            FS.admissionList = data.filter(function(x){return x.section!="SER"&&x.section!="PER";});
            if(FS.admissionList){
                var admission=FS.admissionList[0];
                var caseNo=admission.caseNo;
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
                    viewRender.queryCaseNo(patientID, caseNo);
                })
            }
        });
    });
};

viewRender.queryCaseNo=function(patientID, caseNo){
    var admission = FS.admissionList.filter(function(x){return x.caseNo==caseNo;})
    if(admission&&admission[0]){
        admission=admission[0];
        FS.caseNo=caseNo;
        FS.admissionDate=admission.admissionDate;
        FS.dischargeDate=admission.dischargeDate;
        var qdate = FS.dischargeDate||Parser.getDate();

        requestVitalSign(patientID, caseNo, "HWS",function(data,timeStamp){  //caseNo="all"可查詢全部資料
            if(FS.admissionList.slice(-1)[0].section=="NB"){
                requestVitalSign(patientID, FS.admissionList.slice(-1)[0].caseNo, "HWS",function(firstAddata,timeStamp){
                    data.data=data.data.concat(firstAddata.data);
                    viewRender.bw.initialize(data);
                    viewRender.queryDate(patientID,caseNo,qdate);
                });
            }else{
                viewRender.bw.initialize(data);
                viewRender.queryDate(patientID,caseNo,qdate);
            }
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
            viewRender.flowSheet.selectDate(date);
            $('#datepicker').datepicker("setDate", FS.currentDate);
        });
}


