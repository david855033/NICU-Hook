"use strict";

var bwHolder=[];
var view= new Vue({
    el:'#view',
    data:{
        accountDOC:"DOC3924B",
        passwordDOC:"888888",
        cookieDOC:"",
        viewList:['dev','flow-sheet'],
        selectedView:"flow-sheet",
        wardList:["NICU","PICU","NBR","A091"],
        patientList:{content:[], timeStamp:""},
        selectedPatientID:"",
        selectedCaseNo:"",
        admissionList:{content:[], timeStamp:""},
        dev:{
            patientData:{
                content:{
                    currentBed:"",
                    patientName:"",
                    birthDate:"",
                    gender:"",
                    bloodType:"",
                    currentSection:"",
                    visitingStaff:{name:"",code:""},
                    resident:{name:"",code:""}
                },
                timeStamp:""
            },
            changeBedSection:{
                content:{changeBed:[],changedSection:[]},
                timeStamp:""
            },
            consultation:{
                content:[],
                timeStamp:""
            },
            consultationReply:{
                content:"",
                timeStamp:""
            },
            consultationPending:{
                content:[],
                timeStamp:""
            },
            surgery:{
                content:[],
                timeStamp:""
            },
            order:{
                content:[],
                timeStamp:""
            },
            report:{
                content:[],
                timeStamp:""
            },
            reportContent:{
                content:{htmlText:"",parsed:[]},
                timeStamp:""
            },
            cummulative:{
                content:{colNames:[], data:[]},
                timeStamp:""
            },
            availableCummulativeList:[
                {queryString:"DCHEM",item:"SMAC"},
                {queryString:"DCBC",item:"CBC"},
                {queryString:"DGLU1",item:"床邊血糖"},
                {queryString:"DBGAS",item:"BloodGas"}
            ],
            selectedCummulativeList:"DCHEM",
            vitalSign:{
                content:{colNames:[], data:[]},
                timeStamp:""
            },
            availableVitalSignList:[
                {queryString:"HWS",item:"身高體重"},
                {queryString:"BPP",item:"血壓脈搏"},
                {queryString:"IO",item:"輸入輸出"},
                {queryString:"TMP",item:"體溫"},
                {queryString:"RSP",item:"呼吸"},
                {queryString:"OXY",item:"血氧濃度"}
            ],
            selectedVitalSignList:"HWS"
            ,treatment:{
                content:[],
                timeStamp:""
            },
            transfusion:{
                content:[],
                timeStamp:""
            },
            medication:{
                content:[],
                timeStamp:""
            },
            medicationInfo:{
                content:{caseNo:"",seq:"",content:""},
                timeStamp:""
            },
            birthSheet:{
                content:{
                    hasBirthSheet:false,
                    mother:{ID:"",name:"",admissionReason:""},
                    child:{GAweek:"",GAday:"",ROMDateTime:"",deliverDateTime:"",deliverMethod:""
                        ,ApgarScore:[],management:[]
                    }
                },
                timeStamp:""
            },
            NISHandOver:{
                content:{
                    patientInfo:[],history:[],health:[],line:[],note:[]
                },
                timeStamp:""
            },
            flowSheet:[]
        },
        flowSheet:{
            headerCards:[],
            showDatePicker:false,
            showAdPicker:false,
            showBW:false,
            currentDate:Parser.getDate(),
            weekDay:"",
            dayDifference:"",
            bed:"NICU-1",
            name:"好早生之女",
            vs:"曹大大",
            patientID:"12345678",
            caseNo:"",
            admissionList:[],
            admissionDate:"2017-07-01",
            dischargeDate:"2017-07-10",
            birthday:"2017-06-30",
            birthSheet:{},
            GAweek:"",
            GAday:"",
            bwForCalculate:"",
            inputBW:"",
            bwLast:"9.99",
            bwLastDate:Parser.getDate(),
            bwDelta:"99",
            bwFirst:"0.99",
            bbw:"0.999",
            chart:[],
            footbarStatus:"min",
            footbarMenuList:[{key:'fnOverview',title:'總覽'},{key:'fnIO',title:'輸出入'},{key:'fnVentilation',title:'呼吸'},
            {key:'fnNutrition',title:'營養'},
            {key:'fnLab',title:'檢驗'},{key:'fnInfection',title:'感染'},{key:'fnMedication',title:'藥物'},{key:'fnConsult',title:'會診'},
            {key:'fnTransfusion',title:'輸血'},{key:'fnSurgery',title:'手術'},{key:'fnNurse',title:'護理'}],
            selectedfootbarMenu:"fnOverview",
            io:{
                morning:{IV:"",Feed:"",input:"",urine:"",UO:"",IO:""},
                afternoon:{},
                night:{},
                day1:{},
                day2:{},
                day3:{},
            }
        }
    },
    computed:{
        isFlowSheetFirstDay:function(){
            return this.flowSheet.currentDate==this.flowSheet.admissionDate;
        },
        isFlowSheetLastDay:function(){
            return this.flowSheet.currentDate==this.flowSheet.dischargeDate||this.flowSheet.currentDate==Parser.getDate();
        }
    },
    watch:{
        'flowSheet.footbarStatus':function(){
            if(view.flowSheet.footbarStatus=="min"){
                Layout.footbar.min();
            }else if(view.flowSheet.footbarStatus=="max"){
                Layout.footbar.max();
            }else{
                Layout.footbar.close();
            }
        },
        selectedView:function(){
            if(view.selectedView=="flow-sheet"){
                setTimeout(function() {
                    Layout.onWidthChange();
                }, 0);
            }
        }
    },
    methods:{
        signIn:function(callback){
            server.signIn(view.accountDOC,view.passwordDOC,callback);
        },
        updatePatientList:function(ward){
            requestPatientList(ward,function(data,timeStamp){
                view.patientList.content = data;
                view.patientList.timeStamp = timeStamp;
            });
        },
        updateAdmissionList:function(patientID){
            requestAdmissionList(patientID,function(data,timeStamp){
                view.admissionList.content = data;
                view.admissionList.timeStamp = timeStamp;
                view.selectedCaseNo=view.admissionList.content&&view.admissionList.content[0].caseNo;
                // view.updateCase(patientID, view.selectedCaseNo);    //for dev show
            });
        },
        updatePatient:function(patientID){
            view.selectedPatientID=patientID;
            // view.updateAdmissionList(patientID);
            // view.updatePatientData(patientID)
            // view.updateChangeBedSection(patientID);
            // view.updateConsultation(patientID);
            // view.updateConsultationPending(patientID);
            // view.updateSurgery(patientID);
            // view.updateOrder(patientID,7);
            // view.updateReport(patientID, 1);
            // view.updateCummulative(patientID,3,view.dev.selectedCummulativeList);
            
            viewRender.queryPatientData(patientID);
        },
        updateCase:function(patientID, caseNo){
            patientID=patientID||view.selectedPatientID;
            view.selectedCaseNo=caseNo;

            view.updateVitalSign(patientID, caseNo, view.dev.selectedVitalSignList);
            view.updateTreatment(patientID, caseNo);
            view.updateTransfusion(patientID, caseNo);
            view.updateMedication(patientID, caseNo);
            view.updateBirthSheet(patientID, caseNo);
            view.updateNISHandOver(patientID, caseNo);
            view.updateFlowSheet(patientID, caseNo, Parser.getDateTime());
        },
        updatePatientData:function(patientID){
            requestPatientData(patientID,function(data,timeStamp){
                view.dev.patientData.content = data;
                view.dev.patientData.timeStamp = timeStamp;
            });
        },
        updateChangeBedSection:function(patientID){
            requestChangeBedSection(patientID,function(data,timeStamp){
                view.dev.changeBedSection.content=data;
                view.dev.changeBedSection.timeStamp=timeStamp;
            });
        },
        updateConsultation:function(patientID){
            requestConsultation(patientID,function(data,timeStamp){
                view.dev.consultation.content=data;
                view.dev.consultation.timeStamp=timeStamp;
            });
        },
        updateConsultationReply:function(patientID,caseNo, oseq){
            requestConsultationReply(patientID,caseNo, oseq, function(data,timeStamp){
                view.dev.consultationReply.content=data;
                view.dev.consultationReply.timeStamp=timeStamp;
            });
        },
        updateConsultationPending:function(patientID){
            requestConsultationPending(patientID,function(data,timeStamp){
                view.dev.consultationPending.content=data;
                view.dev.consultationPending.timeStamp=timeStamp;
            });
        },
        updateSurgery:function(patientID){
            requestSurgery(patientID,function(data,timeStamp){
                view.dev.surgery.content=data;
                view.dev.surgery.timeStamp=timeStamp;
            });
        },
        updateOrder:function(patientID, days){
            requestOrder(patientID,days,function(data,timeStamp){
                view.dev.order.content=data;
                view.dev.order.timeStamp=timeStamp;
            });
        },
        updateReport:function(patientID, monthsOrYear){
            requestReport(patientID,monthsOrYear,function(data,timeStamp){
                view.dev.report.content=data;
                view.dev.report.timeStamp=timeStamp;
            });
        },
        updateReportContent:function(patientID,partNo,caseNo, orderSeq){
            requestReportContent(patientID,partNo,caseNo, orderSeq,function(data,timeStamp){
                view.dev.reportContent.content=data;
                view.dev.reportContent.timeStamp=timeStamp;
            });
        },
        updateCummulative:function(patientID,monthsOrYear, field){
            requestCummulative(patientID,monthsOrYear,field,function(data,timeStamp){
                view.dev.cummulative.content=data;
                view.dev.cummulative.timeStamp=timeStamp;
            });
        },
        updateVitalSign:function(patientID,caseNo, field){
            requestVitalSign(patientID,caseNo, field,function(data,timeStamp){
                view.dev.vitalSign.content=data;
                view.dev.vitalSign.timeStamp=timeStamp;
            });
        },
        updateTreatment:function(patientID, caseNo){
            requestTreatment(patientID, caseNo,function(data,timeStamp){
                view.dev.treatment.content=data;
                view.dev.treatment.timeStamp=timeStamp;
            });
        },
        updateTransfusion:function(patientID, caseNo){
            requestTransfusion(patientID, caseNo,function(data,timeStamp){
                view.dev.transfusion.content=data;
                view.dev.transfusion.timeStamp=timeStamp;
            });
        },
        updateMedication:function(patientID,caseNo){
            requestMedication(patientID,caseNo,function(data,timeStamp){
                view.dev.medication.content=data;
                view.dev.medication.timeStamp=timeStamp;
            });
        },
        updateMedicationInfo:function(patientID,caseNo,seq){
            updateMedicationInfo(patientID,caseNo,seq,function(data,timeStamp){
                view.dev.medicationInfo.content.content=data;
                view.dev.medicationInfo.content.caseNo=caseNo;
                view.dev.medicationInfo.content.seq=seq;
                view.dev.medicationInfo.timeStamp=timeStamp;
            });
        },
        updateBirthSheet:function(patientID,caseNo)
        {
            updateBirthSheet(patientID,caseNo,function(data,timeStamp){
                view.dev.birthSheet.content=data;
                view.dev.birthSheet.timeStamp=timeStamp;
            });
        },
        updateNISHandOver:function(patientID,caseNo)
        {
            updateNISHandOver(patientID,caseNo,function(data,timeStamp,field)
            {
                view.dev.NISHandOver.content[field]=data;
                view.dev.NISHandOver.timeStamp=timeStamp;
            });
        },
        updateFlowSheet:function(patientID, caseNo, date){
            date=Parser.getShortDate(date);
            requestFlowSheet(patientID,caseNo, date,function(data,timeStamp)
            {
                var obj={};
                obj.date=date;
                obj.content=data;
                obj.timeStamp=timeStamp;
                var index = view.dev.flowSheet.findIndex(function(x){return x.date==date;});
                if(index<0)
                {
                    view.dev.flowSheet.splice(1,0,obj);    
                }else
                {
                    view.dev.flowSheet.splice(index,1,obj);            
                }
            });
        },
        queryCaseNo:function(patientID,caseNo){
            patientID=patientID||view.flowSheet.patientID;
            viewRender.queryCaseNo(patientID,caseNo);
        },
        setBW:function(){
            var fixBW=view.flowSheet.inputBW.match(/\d+(.\d+)?/);
            fixBW=(Number(fixBW&&fixBW[0]))||"";
            if(fixBW>=300){fixBW/=1000};
            var index= bwHolder.indexOf(function(x){x.patientID==view.flowSheet.patientID;});
            if(index>=0){
                var savedBW = savedBW[index];
            }else{
                bwHolder.push({patientID:view.flowSheet.patientID,bw:fixBW});
            }

            view.flowSheet.bwForCalculate=view.flowSheet.inputBW=fixBW;
            view.flowSheet.showBW=false;
            viewRender.queryDate(view.flowSheet.currentDate);
        },
        clearBW:function(){
            var index= bwHolder.indexOf(function(x){x.patientID==view.flowSheet.patientID;});
            if(index>=0){
                savedBW[index].bw="";
            }
            view.flowSheet.bwForCalculate=view.flowSheet.inputBW="";
            view.flowSheet.showBW=false;
            viewRender.queryDate(view.flowSheet.currentDate);
        },
        selectFlowSheetFn:function(fn){
            view.flowSheet.selectedfootbarMenu=fn;
            if(view.flowSheet.footbarStatus=='close'){
                view.flowSheet.footbarStatus='min';
            }
        },
        dayChange:function(n){
            if(n=='first'){
                viewRender.queryDate(view.flowSheet.patientID,view.flowSheet.caseNo,view.flowSheet.admissionDate);
            }else if(n=='last'){
                viewRender.queryDate(view.flowSheet.patientID,view.flowSheet.caseNo,view.flowSheet.dischargeDate||Parser.getDate());
            }else{
                var date = new Date(view.flowSheet.currentDate);
                date.setDate(date.getDate() + n);
                if(date>new Date()){date=new Date()};
                var dischargeDate=new Date(view.flowSheet.dischargeDate);
                if(view.flowSheet.dischargeDate&&date>dischargeDate){date=dischargeDate;}
                var admissionDate=new Date(view.flowSheet.admissionDate);
                if(view.flowSheet.admissionDate&&date<admissionDate){date=admissionDate;}
                viewRender.queryDate(view.flowSheet.patientID,view.flowSheet.caseNo,Parser.getDate(date));
                
            }
        }
    },
})


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
        if(FS.bbw){
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

viewRender.bt={};
viewRender.bt.parsed=[];
viewRender.bt.limit=[36,38];
viewRender.bt.initialize=function(rawData){
    if(!rawData||!rawData.colNames){
        return;
    }
    var indexDate = rawData.colNames.indexOf("日期時間");
    var indexBT = rawData.colNames.indexOf("體溫");
    var parsedbt=[];
    var lastPushedDateTime="";
    rawData.data.forEach(function(x){
        if(x[indexDate]!=lastPushedDateTime){
            parsedbt.push({dateTime:x[indexDate],bt:Parser.getNumberPartFromString(x[indexBT])});
            lastPushedDateTime=x[indexDate];
        }
    });
    parsedbt.sort(function(a,b){return new Date(a.dateTime)-new Date(b.dateTime)});
    viewRender.bt.parsed=parsedbt;
}
viewRender.bt.toShow=[];
viewRender.bt.selectDate=function(date){
    var parsedbt=viewRender.bt.parsed;
    var tommorow =Parser.addDate(date,1);

    var startDateTime=date+" 07:00";
    var endDateTime=Parser.getDate(tommorow)+" 07:00";

    var startIndex=1 + parsedbt.findLastIndexOf(function(x){
        return new Date(x.dateTime)< new Date(startDateTime);
    });
    var endIndex= parsedbt.findLastIndexOf(function(x){
        return new Date(x.dateTime) < new Date(endDateTime);
    });
  
    var toShow=[];
    var pushedData=[];
    for(var i = startIndex; i<=endIndex;i++)
    {
        var hour = Parser.getHour(parsedbt[i].dateTime)
        hour-=7;
        if(hour<0){hour+=24;}
        toShow[hour]||(toShow[hour]="");
        pushedData[hour]||(pushedData[hour]=[]);   //用來排除同樣資料
        if(!pushedData[hour].find(function(x){return x==parsedbt[i].bt;})){
            var limit=viewRender.bt.limit;
    
            if(limit[1]&&parsedbt[i].bt>=limit[1]){
                toShow[hour]+=div(parsedbt[i].bt,['red','heavy-weight']);
            }else if(limit[0]&&parsedbt[i].bt<limit[0]){
                toShow[hour]+=div(parsedbt[i].bt,['blue','heavy-weight']);
            }else{
                toShow[hour]+=div(parsedbt[i].bt);
            }
            pushedData[hour].push(parsedbt[i].bt);
        }
    }
    viewRender.bt.toShow=toShow;
}

viewRender.hrbp={};
viewRender.hrbp.parsed={};
viewRender.hrbp.toShow={hr:[],sbp:[],dbp:[],mbp:[]};
viewRender.hrbp.limit={hr:[90,180],sbp:[60],dbp:[30],mbp:[40]};
viewRender.hrbp.initialize=function(rawData){
    if(!rawData||!rawData.colNames){
        return;
    }
    
    var indexDate = rawData.colNames.indexOf("日期時間");
    var indexhr = rawData.colNames.indexOf("脈膊");
    var indexbp = rawData.colNames.indexOf("收縮壓/舒張壓");
    var parsed=[];
    var lastPushedDateTime="";
    rawData.data.forEach(function(x){
        var dateTime = x[indexDate];
        if(dateTime!=lastPushedDateTime){
            var hr=Parser.getNumberPartFromString(x[indexhr]);
            var part = x[indexbp].split('/');
            var sbp=part[0]&&Parser.getNumberPartFromString(part[0]);
            var dbp=part[1]&&Parser.getNumberPartFromString(part[1]);
            var mbp=sbp&&dbp&&(Math.round(sbp/3+dbp*2/3));
            var thisData={dateTime:dateTime,hr:hr,sbp:sbp,dbp:dbp,mbp:mbp};
            parsed.push(thisData);
            lastPushedDateTime=dateTime;
        }
    });
    parsed.sort(function(a,b){return new Date(a.dateTime)-new Date(b.dateTime)});
    viewRender.hrbp.parsed=parsed;
};
viewRender.hrbp.selectDate=function(date){
    var parsed=viewRender.hrbp.parsed;
    var tommorow =Parser.addDate(date,1);
    var startDateTime=date+" 07:00";
    var endDateTime=Parser.getDate(tommorow)+" 07:00";

    var startIndex=1 + parsed.findLastIndexOf(function(x){
        return new Date(x.dateTime) < new Date(startDateTime);
    });
    var endIndex= parsed.findLastIndexOf(function(x){
        return new Date(x.dateTime) < new Date(endDateTime);
    });
    var toShow={hr:[],sbp:[],dbp:[],mbp:[]};
    var pushedData={hr:[],sbp:[],dbp:[],mbp:[]};
    for(var i = startIndex; i<=endIndex;i++)
    {
        var hour = Parser.getHour(parsed[i].dateTime);
        hour-=7;
        if(hour<0){hour+=24;}
        toShow.hr[hour]||(toShow.hr[hour]="");
        toShow.sbp[hour]||(toShow.sbp[hour]="");
        toShow.dbp[hour]||(toShow.hr[hour]="");
        toShow.mbp[hour]||(toShow.hr[hour]="");
        //用來排除同樣資料
        pushedData.hr[hour]||(pushedData.hr[hour]=[]);   
        console.log(parsed[i]);
        if(!pushedData.hr[hour].find(function(x){return x==parsed[i].hr;})){
            var limit=viewRender.hrbp.limit.hr;
            var value = parsed[i].hr;
            if(value){
                if(limit[1]&&value>=limit[1]){
                    toShow.hr[hour]+=div(value,['red','heavy-weight']);
                }else if(limit[0]&&value<limit[0]){
                    toShow.hr[hour]+=div(value,['red','heavy-weight']);
                }else{
                    toShow.hr[hour]+=div(value);
                }
                pushedData.hr[hour].push(value);
            }
        };
        pushedData.sbp[hour]||(pushedData.sbp[hour]=[]);
        pushedData.dbp[hour]||(pushedData.dbp[hour]=[]);
        pushedData.mbp[hour]||(pushedData.mbp[hour]=[]);
    }

    viewRender.hrbp.toShow=toShow;
};

viewRender.chart = {
    initialize:function(){
        var chartArray =[];
        var TPRTable={
            classes:['tpr'],
            rows:[this.header(),
                this.tprRow("體溫","(&#8451;)",viewRender.bt.limit,viewRender.bt.toShow),
                this.tprRow("心律","(/min)",viewRender.hrbp.limit.hr,viewRender.hrbp.toShow.hr),
                this.tprRow("呼吸","(/min)",[30,60],[]),
                this.tprRow("SpO<sub>2</sub>","(/min)",[85,100],[]),
                this.spacerRow(),
                this.tprRow("SBP","(mmHg)",viewRender.hrbp.limit.sbp,viewRender.hrbp.toShow.sbp),
                this.tprRow("DBP","(mmHg)",viewRender.hrbp.limit.dbp,viewRender.hrbp.toShow.dbp),
                this.tprRow("MBP","(mmHg)",viewRender.hrbp.limit.mbp,viewRender.hrbp.toShow.mbp),
            ]
        };
        chartArray.push(TPRTable);
        var InfusionTable={
            classes:['infusion'],
            rows:[
                this.row("IV","(ml)","NS Drug drug drug",[]),
                this.row("CVC","(ml)","",[1,2,4,5,222,333]),
            ]
        };
        chartArray.push(InfusionTable);
        var transfusionTable={
            classes:['transfusion'],
            rows:[
                this.row("PRBC","(ml)","",[,,,,,,,,,,,,3.5,3.5,3.5]),
                this.row("PLT","(ml)","",[,,,,9,9,,,,]),
            ]
        };
        chartArray.push(transfusionTable);
    
        var feedingTable={
            classes:['feeding'],
            rows:[
                this.row("PO","(ml)","",[,,10+div("配方",["nowrap"]),,10+div("配方",["nowrap"]),,10+div("配方",["nowrap"])]),
                this.row("NG/OG","(ml)","",[,,,,,,,,,,,,,,10]),
                this.row("RV","(ml)","",[,,"0",,,,,,,,,,,,]),
                this.row("NG/OG Drain","(ml)","",[,,,,,,,,,,,,,,10])
            ]
        };
        chartArray.push(feedingTable);
    
        var excretionTable={
            classes:['excretion'],
            rows:[
                this.row("Urine","(ml)","",[]),
                this.row("Stool","(ml)","",[]),
                this.row("Enema/Sti.","","",[])
            ]
        };
        chartArray.push(excretionTable);
    
        var drainTable={
            classes:['drain'],
            rows:[
                this.row("Drain","(ml)","Colostomy",[]),
                this.row("Dialysis","(ml)","",[]),
            ]
        };
        chartArray.push(drainTable);
    
    
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
    Layout.footbar&&Layout.footbar.min();
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
            viewRender.queryDate(date);
            FS.showDatePicker=false;
        },
        dateFormat: 'yy-mm-dd'
    });
    $('#datepicker').datepicker('option', 'minDate', new Date(FS.admissionDate||FS.birthDate));
    $('#datepicker').datepicker('option', 'maxDate', new Date(FS.dischargeDate||Parser.getDate()));
    $('#datepicker').datepicker('option', 'currentDate', new Date(FS.currentDate||""));
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
        requestVitalSign(patientID, caseNo, "TMP",function(data,timeStamp){ 
            viewRender.bt.initialize(data);

            requestVitalSign(patientID, caseNo, "BPP",function(data,timeStamp){ 
                viewRender.hrbp.initialize(data);

                requestVitalSign(patientID, caseNo, "HWS",function(data,timeStamp){  //caseNo="all"可查詢全部資料
                    if(FS.admissionList.slice(-1)[0].section=="NB"){
                        requestVitalSign(patientID, FS.admissionList.slice(-1)[0].caseNo, "HWS",function(firstAddata,timeStamp){
                            data.data=data.data.concat(firstAddata.data);
                            viewRender.bw.initialize(data);
                            viewRender.queryDate(qdate);
                        });
                    }else{
                        viewRender.bw.initialize(data);
                        viewRender.queryDate(patientID,caseNo,qdate);
                    }
                });
            });
        });
    };
}

viewRender.queryDate=function(patientID,caseNo,date){
    FS.currentDate=date;
    viewRender.bt.selectDate(date);
    viewRender.hrbp.selectDate(date);
    requestFlowSheet(patientID,caseNo, Parser.getShortDate(date),function(data,timeStamp)
    {
        console.log(data);
        viewRender.initialize();
    });
}

