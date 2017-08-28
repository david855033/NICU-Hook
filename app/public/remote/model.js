;'use strict';
var queryData=function(query, callback){
    // from datastructure;
    var queryDataSet_local={};
    
    if(query.indexOf('preSelect')<0){
        dataManager.get(query,function(queryDataSet){
            if(queryDataSet){
                queryDataSet_local=queryDataSet;
                callback(queryDataSet.data, queryDataSet.timeStamp);  
            }
        })
    }

    //from server
    serverRequest=queryToServerRequest(query);

    server.request(serverRequest, function(serverData, timeStamp){ 
        var parsedData = serverRequest.parser?serverRequest.parser(serverData):serverData;
        callback(parsedData, timeStamp);
        if(!queryDataSet_local.timeStamp || queryDataSet_local.timeStamp <  timeStamp)
        {
            dataManager.set(query, serverRequest.url, timeStamp, parsedData);
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
    }
}