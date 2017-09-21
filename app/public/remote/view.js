"use strict";


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
            showAdPicker:true,
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
            GAweek:"35",
            GAday:"3",
            currentBW:"2.5",
            bbw:"2.4",
            chart:[],
            footbarStatus:"min",
            footbarMenuList:[{key:'fnOverview',title:'總覽'},{key:'fnIO',title:'輸出入'},{key:'fnVentilation',title:'呼吸'},
            {key:'fnNutrition',title:'營養'},
            {key:'fnLab',title:'檢驗'},{key:'fnInfection',title:'感染'},{key:'fnMedication',title:'藥物'},{key:'fnConsult',title:'會診'},
            {key:'fnTransfusion',title:'輸血'},{key:'fnSurgery',title:'手術'},{key:'fnNurse',title:'護理'}],
            selectedfootbarMenu:"fnOverview"
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
                view.updateCase(patientID, view.selectedCaseNo);    //for dev show
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

            // view.updateVitalSign(patientID, caseNo, view.dev.selectedVitalSignList);
            // view.updateTreatment(patientID, caseNo);
            // view.updateTransfusion(patientID, caseNo);
            // view.updateMedication(patientID, caseNo);
            // view.updateBirthSheet(patientID, caseNo);
            // view.updateNISHandOver(patientID, caseNo);
            // view.updateFlowSheet(patientID, caseNo, Parser.getDateTime());
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
            updateFlowSheet(patientID,caseNo, date,function(data,timeStamp)
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
            viewRender.queryCaseNo(patientID,caseNo);
        },
        selectFlowSheetFn:function(fn){
            view.flowSheet.selectedfootbarMenu=fn;
            if(view.flowSheet.footbarStatus=='close'){
                view.flowSheet.footbarStatus='min';
            }
        },
        dayChange:function(n){
            
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

var viewRender={};
viewRender.header={
    initialize:function(){
        var FS=view.flowSheet;
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
        }else if(FS.GAweek<37){  //no preterm
            var ageInDay=Number(Parser.getDayDifference(FS.birthday, FS.currentDate))+Number(FS.GAweek)*7+Number(FS.GAday);
            var GAString="GA："+FS.GAweek + (FS.GAday>0?("+"+FS.GAday):"wk");
            var cGAWeek = Math.floor(ageInDay/7);
            var cGADay = (ageInDay)%7;
            var cGAString = cGAWeek + (cGADay>0?("+"+cGADay):"wk");
            if(cGAWeek<40){
                headerCards.push(new this.headerCard("矯正週數",cGAString,GAString));            
            }else{
                var correctedAgeStr=Parser.getCorrectedAgeString(ageInDay);
                headerCards.push(new this.headerCard("矯正年齡",correctedAgeStr,GAString));
            }
        }else{// fullterm
            headerCards.push(new this.headerCard("出生週數",FS.GAweek+(FS.GAday?("+"+FS.GAday):"")));
        }

        var ageStr=Parser.getAgeString(FS.currentDate,FS.birthday);
        headerCards.push(new this.headerCard("實際年齡",ageStr,"生日："+FS.birthday));
        
        var currentBWString=FS.currentBW;
        headerCards.push(new this.headerCard("體重",currentBWString,"出生體重"));

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

viewRender.chart = {
    initialize:function(){
        var chartArray =[];
        var TPRTable={
            classes:['tpr'],
            rows:[this.header(),
                this.tprRow("體溫","(&#8451;)",[36,38],[]),
                this.tprRow("心律","(/min)",[100,180],[]),
                this.tprRow("呼吸","(/min)",[30,60],[]),
                this.tprRow("SpO<sub>2</sub>","(/min)",[85,100],[]),
                this.spacerRow(),
                this.tprRow("SBP","(mmHg)",[45,],[]),
                this.tprRow("DBP","(mmHg)",[20,],[]),
                this.tprRow("MBP","(mmHg)",[35,],[]),
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
                resultArray.push(new cell(data[i],'data-color'))
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

viewRender.initialize=function(patientID, currentDate){
    var FS=view.flowSheet;
    $('#datepicker').datepicker({
        onSelect: function(date) {
            viewRender.setDate(date);
            view.flowSheet.showDatePicker=false;
        },
        dateFormat: 'yy-mm-dd'
    });
    currentDate=currentDate||Parser.getDate();
    
    viewRender.chart.initialize();
    viewRender.header.initialize();
}
viewRender.setDate=function(date){
    viewRender.initialize("",date);
    view.flowSheet.currentDate=date;
    viewRender.adjustHeaderWidth();
}
viewRender.queryPatientData=function(patientID){
    var FS=view.flowSheet;
    FS.patientID=patientID;
    requestPatientData(patientID,function(data,timeStamp){
        FS.patientID=patientID;
        FS.bed=data&&data.currentBed;
        FS.name=data&&data.patientName;
        FS.birthday=data&&data.birthDate;
        FS.vs=data&&data.visitingStaff&&data.visitingStaff.name;
        requestAdmissionList(patientID,function(data,timeStamp){
            FS.admissionList = data.filter(function(x){return x.section!="SER"&&x.section!="PER";});
            if(FS.admissionList){
                var admission=FS.admissionList[0];
                viewRender.queryCaseNo(patientID,admission.caseNo);
            }
        });
    });
};

viewRender.queryCaseNo=function(patientID,caseNo){
    var FS=view.flowSheet;
    var admission = FS.admissionList.filter(function(x){return x.caseNo==caseNo;})
    if(admission){
        admission=admission[0];
        FS.caseNo=caseNo;
        FS.admissionDate=admission.admissionDate;
        FS.dischargeDate=admission.dischargeDate;
    };
    viewRender.initialize();
    viewRender.adjustHeaderWidth();
}

viewRender.adjustHeaderWidth=function(){
    setTimeout(function() {
        Layout.selectHeaderCards();
        Layout.onWidthChange();
    }, 0);
}

viewRender.initialize();