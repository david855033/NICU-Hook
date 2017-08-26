;'use strict';
var requestView=function(callback){
    queryData("admisionList_NICU",function(data, timeStamp){
        callback&&callback(data, timeStamp);
    });
}