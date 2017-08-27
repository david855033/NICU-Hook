;'use strict';
var requestPatientList=function(ward,callback){
    queryData("admisionList_"+ward,function(data, timeStamp){
        callback&&callback(data, timeStamp);
    });
}