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
var requestChangeBedSection=function(patientID, callback){
    preSelectPatient(patientID, function(data_preSelect, timeStamp_preSelect){
        queryData("changeBedSection_"+patientID,function(data, timeStamp){
            callback&&callback(data, timeStamp);
         });
    });
}
var requestConsultation=function(patientID, callback){
    queryData("consultation_"+patientID,function(data, timeStamp){
        callback&&callback(data, timeStamp);
    });
}
var requestConsultationReply=function(patientID,caseNo, oseq,callback){
    queryData("consultationReply_"+patientID+"_"+caseNo+"_"+oseq, function(data, timeStamp){
        callback&&callback(data, timeStamp);
    });
}
var requestConsultationPending=function(patientID, callback){
    queryData("consultationPending_"+patientID,function(data, timeStamp){
        callback&&callback(data, timeStamp);
    });
}
var requestSurgery=function(patientID, callback){
    preSelectPatient(patientID, function(data_preSelect, timeStamp_preSelect){
        queryData("surgery_"+patientID,function(data, timeStamp){
            callback&&callback(data, timeStamp);
        });
    });
}
var requestOrder=function(patientID, days,callback){
    preSelectPatient(patientID, function(data_preSelect, timeStamp_preSelect){
        queryData("order_"+patientID+"_"+days,function(data, timeStamp){
            callback&&callback(data, timeStamp);
        });
    });
}
var requestReport=function(patientID, monthsOrYear, callback){
    preSelectPatient(patientID, function(data_preSelect, timeStamp_preSelect){
        queryData("report_"+patientID+"_"+monthsOrYear,function(data, timeStamp){
            callback&&callback(data, timeStamp);
        });
    });
}
var requestReportContent=function(patientID,partNo,caseNo, orderSeq, callback){
    queryData("reportContent_"+patientID+"_"+partNo+"_"+caseNo+"_"+orderSeq,function(data, timeStamp){
        callback&&callback(data, timeStamp);
    });
}
var requestCummulative=function(patientID, monthsOrYear, field, callback){
    preSelectPatient(patientID, function(data_preSelect, timeStamp_preSelect){
        queryData("cummulative_"+patientID+"_"+monthsOrYear+"_"+field,function(data, timeStamp){
            callback&&callback(data, timeStamp);
        });
    });
}
var requestVitalSign=function(patientID,caseNo, field, callback){
    preSelectPatient(patientID, function(data_preSelect, timeStamp_preSelect){
        queryData("vitalSign_"+patientID+"_"+caseNo+"_"+field,function(data, timeStamp){
            callback&&callback(data, timeStamp);
        });
    });
}
var requestTreatment=function(patientID, caseNo, callback){
    preSelectPatient(patientID, function(data_preSelect, timeStamp_preSelect){
        queryData("treatment_"+patientID+"_"+caseNo,function(data, timeStamp){
            callback&&callback(data, timeStamp);
        });
    });
}
var requestTransfusion=function(patientID, caseNo,admissionDate, callback){
    preSelectPatient(patientID, function(data_preSelect, timeStamp_preSelect){
        queryData("transfusion_"+patientID+"_"+caseNo+"_"+admissionDate,function(data, timeStamp){
            callback&&callback(data, timeStamp);
        });
    });
}