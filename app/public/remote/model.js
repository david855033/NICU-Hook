"use strict";
var queryData=function(query, callback){
    var notPreSelect=query.indexOf('preSelect')<0;
    var serverRequest=queryToServerRequest(query);
    
    // from datastructure;
    var queryDataSet_local={};
    if(notPreSelect){
        var queryDataSet = dataManager.get(query);
        if(queryDataSet){
            queryDataSet_local = queryDataSet;
            callback(queryDataSet.data, queryDataSet.timeStamp);  
        }
    }

    //from server
    server.request(serverRequest, function(serverData, timeStamp){ 
        var parsedData = serverRequest.parser?serverRequest.parser(serverData):"";
        callback(parsedData, timeStamp);
        if(!queryDataSet_local.timeStamp || queryDataSet_local.timeStamp <  timeStamp)
        {
            if(notPreSelect){
                dataManager.set(query, serverRequest.url, timeStamp, parsedData);
            }
        }
    });
}

//serverRequest {url; method; form;}
var queryToServerRequest=function(query)
{
    var queryList = query.split('_');
    if(queryList[0] == "patientList"){
        return {
            url:"https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findPatient",
            method:"POST",
            form:{wd:queryList[1]},
            parser:Parser.getPatientList
        };
    }else if(queryList[0]  == "preSelectPatient"){
        return {
            url:"https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findEmr&histno="+queryList[1]
        };
    }else if(queryList[0]  == "admissionList"){
        return {
            url:"https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findNicu&histno="+queryList[1],
            parser:Parser.getAdmissionList
        };
    }else if(queryList[0]  == "patientData"){
        return {
            url:"https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findPba&histno="+queryList[1],
            parser:Parser.getPatientData
        };
    }else if(queryList[0]  == "changeBedSection"){
        return {
            url:"https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findPlocs&histno="+queryList[1],
            parser:Parser.getChangeBedSection
        };
    }
}