"use strict";
var view= new Vue({
    el:'#view',
    data:{
        account:"DOC3924B",
        password:"888888",
        cookie:"",
        viewList:['dev','flow-sheet'],
        selectedView:"flow-sheet",
        wardList:["NICU","PICU"],
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
                content:{},
                timeStamp:""
            },
        },
        flowSheet:{
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
        }
    },
    methods:{
        signIn:function(callback){
            server.signIn(view.account,view.password,callback);
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
            view.updateBirthSheet(patientID, caseNo);
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
        selectFlowSheetFn:function(fn){
            view.flowSheet.selectedfootbarMenu=fn;
            if(view.flowSheet.footbarStatus=='close'){
                view.flowSheet.footbarStatus='min';
            }
        }
    }
})