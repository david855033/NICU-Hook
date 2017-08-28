"use strict";
var view= new Vue({
    el:'#view',
    data:{
        account:"",
        password:"",
        wardList:["NICU","PICU"],
        patientList:{content:[], timeStamp:""},
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
        }
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
            view.updateAdmissionList(patientID);
            view.updatePatientData(patientID)
            view.updateChangeBedSection(patientID);
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
        }
    }
})