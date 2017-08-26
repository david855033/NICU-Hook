;'use strict';
var requestDataSheet=function(query, callback){
    
    dataManager.get(query,function(queryData){
        if(queryData){
            callback(queryData.data, queryData.timeStamp);  
        }
    })
    // from datastructure;
   

    // from datastructure;)
    setTimeout(function() {
        //callback("data sheet from server, query="+query, "time stamp");  
    }, 2000); // from server
}