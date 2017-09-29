"use strict";

var bwHolder=[];
var view= new Vue({
    el:'#view',
    data:{
        accountDOC:"DOC3924B",
        passwordDOC:"888888",
        loginStatus:"unlogged",
        cookieDOC:"",
        viewList:['dev','flow-sheet'],
        selectedView:"flow-sheet",
        queryString:'',
        queryType:"查詢",
        queryClass:"",
        queryList:[{query:"NICU",type:"ward"},{query:"PICU",type:"ward"},{query:"NBR",type:"ward"},{query:"A091",type:"ward"},{query:"3840",name:'曹大大',type:"doc"}],
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
        queryString:function(){
            var string = view.queryString;
            var matchID = string.match(/\d{7,8}/);
            matchID=matchID&&matchID[0];
            var matchDOC = string.match(/\d{4}/);
            matchDOC=matchDOC&&matchDOC[0];
            var wardList=['NICU','PICU','NBR','A091'];
            if(string==matchID)
            {
                view.queryType="病歷號";
                view.queryClass="id";
            }else if(string==matchDOC){
                view.queryType="醫師";
                view.queryClass="doc"
            }else if(wardList.find(function(x){return x==string.toUpperCase();})){
                view.queryType="病房";
                view.queryClass="ward"
            }else{
                view.queryType="查詢";
                view.queryClass="";
            }
        },
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
        updatePatientList:function(query){
            view.queryString=query;
            console.log(query);
            $('#left #query-box input').blur();
            return ;//
            requestPatientList(query,function(data,timeStamp){
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
            viewRender.queryDate(view.flowSheet.patientID,view.flowSheet.caseNo, view.flowSheet.currentDate);
        },
        clearBW:function(){
            var index= bwHolder.indexOf(function(x){x.patientID==view.flowSheet.patientID;});
            if(index>=0){
                savedBW[index].bw="";
            }
            view.flowSheet.bwForCalculate=view.flowSheet.inputBW="";
            view.flowSheet.showBW=false;
            viewRender.queryDate(view.flowSheet.patientID,view.flowSheet.caseNo, view.flowSheet.currentDate);
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

