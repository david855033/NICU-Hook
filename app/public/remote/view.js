"use strict";
var view= new Vue({
    el:'#view',
    data:{
        account:"",
        password:"",
        cookie:"",
        wardList:["NICU","PICU"],
        patientList:{content:[], timeStamp:""},
        selectedPatientID:"",
        admissionList:{content:[], timeStamp:""},
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
            {queryString:"DURIN",item:"Urine"},
            {queryString:"DGLU1",item:"床邊血糖"},
            {queryString:"DBGAS",item:"BloodGas"}
        ],
        selectedCummulativeList:"DCHEM"
    },
    methods:{
        signIn:function(){
            server.signIn("DOC3924B","888888");
        },
        updatePatientList:function(ward){
            requestPatientList(ward,function(data,timeStamp){
                view.patientList.content = data;
                view.patientList.timeStamp = timeStamp;
            });
        },
        updatePatient:function(patientID){
            view.selectedPatientID=patientID;
            // view.updatePatientData(patientID)
            // view.updateAdmissionList(patientID);
            // view.updateChangeBedSection(patientID);
            // view.updateConsultation(patientID);
            // view.updateConsultationPending(patientID);
            // view.updateSurgery(patientID);
            // view.updateOrder(patientID,7);
            // view.updateReport(patientID, 1);
            view.updateCummulative(patientID,3,view.selectedCummulativeList);
        },
        updateAdmissionList:function(patientID){
            requestAdmissionList(patientID,function(data,timeStamp){
                view.admissionList.content = data;
                view.admissionList.timeStamp = timeStamp;
            });
        },
        updatePatientData:function(patientID){
            requestPatientData(patientID,function(data,timeStamp){
                view.patientData.content = data;
                view.patientData.timeStamp = timeStamp;
            });
        },
        updateChangeBedSection:function(patientID){
            requestChangeBedSection(patientID,function(data,timeStamp){
                view.changeBedSection.content=data;
                view.changeBedSection.timeStamp=timeStamp;
            });
        },
        updateConsultation:function(patientID){
            requestConsultation(patientID,function(data,timeStamp){
                view.consultation.content=data;
                view.consultation.timeStamp=timeStamp;
            });
        },
        updateConsultationReply:function(patientID,caseNo, oseq){
            requestConsultationReply(patientID,caseNo, oseq, function(data,timeStamp){
                view.consultationReply.content=data;
                view.consultationReply.timeStamp=timeStamp;
            });
        },
        updateConsultationPending:function(patientID){
            requestConsultationPending(patientID,function(data,timeStamp){
                view.consultationPending.content=data;
                view.consultationPending.timeStamp=timeStamp;
            });
        },
        updateSurgery:function(patientID){
            requestSurgery(patientID,function(data,timeStamp){
                view.surgery.content=data;
                view.surgery.timeStamp=timeStamp;
            });
        },
        updateOrder:function(patientID, days){
            requestOrder(patientID,days,function(data,timeStamp){
                view.order.content=data;
                view.order.timeStamp=timeStamp;
            });
        },
        updateReport:function(patientID, monthsOrYear){
            requestReport(patientID,monthsOrYear,function(data,timeStamp){
                view.report.content=data;
                view.report.timeStamp=timeStamp;
            });
        },
        updateReportContent:function(patientID,partNo,caseNo, orderSeq){
            requestReportContent(patientID,partNo,caseNo, orderSeq,function(data,timeStamp){
                view.reportContent.content=data;
                view.reportContent.timeStamp=timeStamp;
            });
        },
        updateCummulative:function(patientID,monthsOrYear, field){
            requestCummulative(patientID,monthsOrYear,field,function(data,timeStamp){
                view.cummulative.content=data;
                view.cummulative.timeStamp=timeStamp;
            });
        }
    }
})