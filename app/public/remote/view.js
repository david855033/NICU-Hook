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
            headerCards:[
                // {top:"1",mid:"2",bottom:"3"}
            ],
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
            view.updateAdmissionList(patientID);

            // view.updatePatientData(patientID)
            // view.updateChangeBedSection(patientID);
            // view.updateConsultation(patientID);
            // view.updateConsultationPending(patientID);
            // view.updateSurgery(patientID);
            // view.updateOrder(patientID,7);
            // view.updateReport(patientID, 1);
            // view.updateCummulative(patientID,3,view.dev.selectedCummulativeList);
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
        selectFlowSheetFn:function(fn){
            view.flowSheet.selectedfootbarMenu=fn;
            if(view.flowSheet.footbarStatus=='close'){
                view.flowSheet.footbarStatus='min';
            }
        }
    },
})


var initializeChart=function(){
    var chartArray =[];

    var TPRTable={
        classes:['tpr'],
        rows:[chartHeader(),
            chartTPRRow("體溫","(&#8451;)",[36,38],[]),
            chartTPRRow("心律","(/min)",[100,180],[]),
            chartTPRRow("呼吸","(/min)",[100,180],[]),
            chartTPRRow("SpO<sub>2</sub>","(/min)",[85,100],[]),
            getSpacerRow(),
            chartTPRRow("SBP","(mmHg)",[45,],[]),
            chartTPRRow("DBP","(mmHg)",[20,],[]),
            chartTPRRow("MBP","(mmHg)",[35,],[]),
        ]
    };
    chartArray.push(TPRTable);

    var InfusionTable={
        classes:['infusion'],
        rows:[
            chartInfusionRow("IV","",[]),
            chartInfusionRow("CVC","",[1,2,4,5,222,333]),
        ]
    };
    chartArray.push(InfusionTable);

    var transfusionTable={
        classes:['transfusion'],
        rows:[
            chartTransfusionRow("PRBC",[,,,,,,,,,,,,3.5,3.5,3.5]),
            chartTransfusionRow("PLT",[,,,,9,9,,,,]),
        ]
    };
    chartArray.push(transfusionTable);

    var feedingTable={
        classes:['feeding'],
        rows:[
            chartFeedingRow("PO","(ml)",[,,10+div("配方"),,10+div("配方"),,10+div("配方")]),
            chartFeedingRow("NG/OG","(ml)",[,,,,,,,,,,,,,,10]),
            chartFeedingRow("RV","(ml)",[,,"0",,,,,,,,,,,,]),
            chartFeedingRow("NG/OG Drain","(ml)",[,,,,,,,,,,,,,,10])
        ]
    };
    chartArray.push(feedingTable);

    var excretionTable={
        classes:['excretion'],
        rows:[
            chartExcretionRow("Urine","(ml)","",[]),
            chartExcretionRow("Stool","(ml)","",[]),
            chartExcretionRow("Enema/Sti.","","",[])
        ]
    };
    chartArray.push(excretionTable);

    view.flowSheet.chart=chartArray;
};

var cell = function(htmlText,classes,tooltip)
{
    this.htmlText=htmlText;
    this.classes=classes||[];
    this.tooltip=tooltip;
};
var chartHeader = function(){
    var resultArray=[];
        resultArray.push(new cell("時間",'title-color'));
        for(var i = 8; i < 24; i++){
            resultArray.push(new cell(i,'header-color'));
        }
        for(var i = 0; i < 8; i++){
            resultArray.push(new cell(i,'header-color'));
        }
    return resultArray;
};
var chartTPRRow = function(title,unit,limit,data){
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
};
var chartInfusionRow = function(route,name,data){
    var resultArray=[];
    data=data||[];
    var titleString=span(route,["route"])+" "+span("(ml)",["unit"])+" "+span(name,["name"]);
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
};
var chartTransfusionRow = function(name,data){
    var resultArray=[];
    data=data||[];
    var titleString=span(name,["name"])+" "+span("(ml)",["unit"]);
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
};
var chartFeedingRow = function(name,unit,data){
    var resultArray=[];
    data=data||[];
    var titleString=span(name,["name"])+" "+span(unit,["unit"]);
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
};
var chartExcretionRow = function(name,unit,content,data){
    var resultArray=[];
    data=data||[];
    var titleString=span(name,["name"])+" "+span(unit,["unit"]);
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
};

var getSpacerRow=function(){
    return [new cell("","spacer")];
};
var span = function(htmlText,classes)
{
    var classString = "";
    if(classes){classString=" class='"+classes.join(" ")+"'";}
    return "<span"+classString+">"+htmlText+"</span>";
};
var div = function(htmlText,classes)
{
    var classString = "";
    if(classes){classString=" class='"+classes.join(" ")+"'";}
    return "<div"+classString+">"+htmlText+"</div>";
};

initializeChart();//