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
    if(queryDataSet_local.timeStamp){
        var secDiff = Parser.getSecondDifference(queryDataSet_local.timeStamp,Parser.getDateTime());
    }else{
        secDiff=100;
    }
    if(secDiff>10||(!queryDataSet_local&&secDiff>1)){   //限制對同一資源的存取間隔
        server.request(serverRequest, function(serverData, timeStamp){ 
            if(serverData=='""'){
                //console.log('not logged, trying log again');
                //重新登入後 再執行一次serverRequest
                view.signIn(function(){
                    server.request(serverRequest, function(serverData, timeStamp){
                        var parsedData = serverRequest.parser?serverRequest.parser(serverData):"";
                        callback(parsedData, timeStamp);
                        if(notPreSelect){
                            dataManager.set(query, serverRequest.url, timeStamp, parsedData);
                        }
                    });
                });
                return;
            };
            var parsedData = serverRequest.parser?serverRequest.parser(serverData):"";
            callback(parsedData, timeStamp);
            if(notPreSelect){
                dataManager.set(query, serverRequest.url, timeStamp, parsedData);
            }
        });
    }
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
    }else if(queryList[0] =="consultation"){
        return {
            url:"https://web9.vghtpe.gov.tw/emr/cps/consultation.cfm?action=find",
            method:"POST",
            form:{cpscwd:'',cpsrsect:'',cpsdept:'',cpsdoc:'',cpshist:queryList[1],month:'',bgndt:'',enddt:''},
            parser:Parser.getConsultation
        };
    }else if(queryList[0] =="consultationReply"){
        return {
            url:"https://web9.vghtpe.gov.tw/emr/cps/consultation.cfm?action=find&histno="+queryList[1]+"&caseno="+queryList[2]+"&oseq="+queryList[3],
            parser:Parser.getConsultationReply
        };
    }else if(queryList[0] =="consultationPending"){
        return {
            url:"https://web9.vghtpe.gov.tw/emr/cps/consultation.cfm?action=add",
            method:"POST",
            form:{cpscwd:'',cpsrsect:'',cpsdept:'',cpsdoc:'',cpshist:queryList[1],cstype:"adm"},
            parser:Parser.getConsultationPending
        };
    }else if(queryList[0] =="surgery"){
        return {
            url:"https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findOpn&histno="+queryList[1],
            parser:Parser.getSurgery
        };
    }else if(queryList[0] =="order"){
        return {
            url:"https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findOrd&histno="+queryList[1]+"&tday="+queryList[2]+"&tdept=ALL",
            parser:Parser.getOrder
        };
    }else if(queryList[0] =="report"){
        return {
            url:"https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findRes&histno="+queryList[1]+"&tmonth="+queryList[2]+"&tdept=ALL",
            parser:Parser.getReport
        };
    }else if(queryList[0] =="reportContent"){
        return {
            url:"https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findRes&partno="+queryList[2]+"&histno="+queryList[1]+"&caseno="+queryList[3]+"&ordseq="+queryList[4]+"&tmonth=03",
            parser:Parser.getReportContent
        };
    }else if(queryList[0] =="cummulative"){
        return {
            url:"https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findResd&histno="+queryList[1]+"&resdtmonth="+queryList[2]+"&resdtype="+queryList[3],
            parser:Parser.getCummulative
        };
    }else if(queryList[0] =="vitalSign"){
        return {
            url:"https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findVts&histno="+queryList[1]+"&caseno="+queryList[2]+"&pbvtype="+queryList[3],
            parser:Parser.getVitalSign
        };
    }else if(queryList[0] =="treatment"){
        return {
            url:"https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findTrt&histno="+queryList[1]+"&caseno="+queryList[2],
            parser:Parser.getTreatment
        };
    }else if(queryList[0] =="transfusion"){
        return {
            url:"https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findBcst&histno="+queryList[1]+"&caseno="+queryList[2]+"&admdt="+queryList[3],
            parser:Parser.getTransfusion
        };
    }
}
