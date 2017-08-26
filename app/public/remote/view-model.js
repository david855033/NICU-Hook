;'use strict';
var requestView=function(callback){
    requestDataSheet("admisionList_NICU",function(data, timeStamp){
        callback&&callback(data, timeStamp);
    });
}