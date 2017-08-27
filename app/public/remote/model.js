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
    var url=queryToUrl(query);
    fakeServer.get(url, function(serverData, timeStamp){ 
        callback(serverData, timeStamp);
        if(!queryDataSet_local.timeStamp || queryDataSet_local.timeStamp <  timeStamp)
        {
            dataManager.set(query, url, timeStamp, serverData);
        }
    });
}

var queryToUrl=function(query)
{
    if(query == "admisionList_NICU")
    {
        return "https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findPatient";
    }
}