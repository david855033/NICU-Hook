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

    fakeServer.get(queryToUrl(query), function(data, timeStamp){ 
        callback(data, timeStamp);  
    });
}

var queryToUrl=function(query)
{
    if(query == "admisionList_NICU")
    {
        return "https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findPatient";
    }
}