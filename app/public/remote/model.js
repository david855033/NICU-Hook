;'use strict';
var queryData=function(query, callback){
    
    // from datastructure;
    var queryDataSet_local={};
    dataManager.get(query,function(queryDataSet){
        if(queryDataSet){
            queryDataSet_local=queryDataSet;
            callback(queryDataSet.data, queryDataSet.timeStamp);  
        }
    })

    //from server
    serverRequest=queryToServerRequest(query);

    fakeServer.request(serverRequest, function(serverData, timeStamp){ 
        var parsedData = Parser.getAdmissionList(serverData);
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
    if(query == "admisionList_NICU")
    {
        return {url:"https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findPatient"};
    }
}