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
    
    // from datastructure;)
    setTimeout(function() {
        //callback("data sheet from server, query="+query, "time stamp");  
    }, 2000); // from server
}