"use strict";
var requestPatientList=function(ward,callback){
    queryData("patientList_"+ward,function(data, timeStamp){
        callback&&callback(data, timeStamp);
    });
}
var preSelectPatient=function(patientID, callback){
    queryData("preSelectPatient_"+patientID,function(data, timeStamp){
        callback&&callback(data, timeStamp);
    });
}
var requestAdmissionList=function(patientID, callback){
    preSelectPatient(patientID, function(data_preSelect, timeStamp_preSelect){
        queryData("admissionList_"+patientID,function(data, timeStamp){
            callback&&callback(data, timeStamp);
         });
    });
}
var requestPatientData=function(patientID, callback){
    preSelectPatient(patientID, function(data_preSelect, timeStamp_preSelect){
        queryData("patientData_"+patientID,function(data, timeStamp){
            callback&&callback(data, timeStamp);
         });
    });
}