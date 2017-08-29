"use strict";
var Parser=Parser||{};
//--------轉換HTML--------
//取得某病房的住院病人
//[{bed:"NICU-1",name:"",patientID:"1234567",gender:"",section:"",admissionDate:""}]
Parser.getPatientList=function(htmlText){
    var resultArray=[];
    var doc = Parser.getDOM(htmlText);
    var tbody = doc.getElementsByTagName("tbody");
    tbody = tbody&&tbody[0];
    if(!tbody){return;}
    var trs = tbody.getElementsByTagName("tr");
    for(var i = 0; i < trs.length; i++){
        var tr=trs[i];
        var tds=tr.getElementsByTagName("td");
        var result = {bed:"",name:"",patientID:"",gender:"",section:"",admissionDate:""};
        var td1_id = tds[1].getAttribute('id');
        var td1_idIsTips = td1_id&&td1_id.indexOf("tips")>=0;
        if(td1_idIsTips)
        {
            Parser.removeElementsByTagName(tds[1],"span");
            result.bed=tds[1].innerText.replaceAll(' ','');
            result.name=tds[2].innerText.trim().replaceAll('@','');
            result.patientID=tds[3].innerText.trim();
            result.gender=tds[4].innerText;
            result.section=tds[5].innerText.trim();
            result.admissionDate=Parser.getDateFromShortDate(tds[7].innerText.trim());
            resultArray.push(result);
        }
    }
    return resultArray;
};

//取得某病患的住院清單
//[{admissionDate:"2017-01-01",dischargeDate:"2017-01-02",caseNo:"1234567",section:""}]
Parser.getAdmissionList=function(htmlText){
    var resultArray=[];
    var doc = Parser.getDOM(htmlText);
    var tbody = doc.getElementsByTagName("tbody");
    tbody = tbody&&tbody[0];
    if(!tbody){return resultArray;}
    var trs = tbody.getElementsByTagName("tr");
    for(var i = 0; i < trs.length; i++){
        var tr=trs[i];
        var tds=tr.getElementsByTagName("td");
        var result = {admissionDate:"",dischargeDate:"",caseNo:"",section:""};
        result.admissionDate=Parser.getDateFromShortDate(tds[2].innerText.trim());
        result.dischargeDate=Parser.getDateFromShortDate(tds[3].innerText.trim());
        result.caseNo=tds[1].innerText.trim();
        result.section=tds[4].innerText.trim();
        resultArray.push(result);
    }
    return resultArray;
};
Parser.getPatientData=function(htmlText){
    var result= { 
        currentBed:"",
        patientName:"",
        birthDate:"",
        gender:"",
        bloodType:"",
        currentSection:"",
        visitingStaff:{name:"",code:""},
        resident:{name:"",code:""}
    };
    var doc = Parser.getDOM(htmlText);
    var tbody = doc.getElementsByTagName("tbody");
    tbody = tbody&&tbody[0];
    if(!tbody){return result;}
    var trs = tbody.getElementsByTagName("tr");
    result.currentBed=trs[1].innerText.replaceAll('０２．　病房床號：','').replaceAll('－',"-").replaceAll(' ','');
    result.patientName=trs[2].innerText.replaceAll('０３．　姓　名　：','').trim();
    result.birthDate=Parser.getDateFromShortDate(trs[3].innerText.replaceAll('０４．　生　日　：','').regReplaceAll(/（.*）/g,"").trim());
    result.gender=trs[4].innerText.replaceAll('０５．　性　別　：','').trim();
    result.bloodType=trs[5].innerText.replaceAll('０６．　血　型　：','').replaceAll(' ','').trim();
    result.currentSection=trs[7].innerText.replaceAll('０８．　科　別　：','').trim();
    result.visitingStaff.name=trs[17].innerText.replaceAll('１８．　主治醫師：','').regReplaceAll(/\(.*\)/g,"").trim();
    result.visitingStaff.code=trs[17].innerText.replaceAll('１８．　主治醫師：','').regSelectAll(/\((.*)\)/g,"").regReplaceAll(/(\(|\))/g,"").trim();
    result.resident.name=trs[18].innerText.replaceAll('１９．　住院醫師：','').regReplaceAll(/\(.*\)/g,"").trim();
    result.resident.code=trs[18].innerText.replaceAll('１９．　住院醫師：','').regSelectAll(/\((.*)\)/g,"").regReplaceAll(/(\(|\))/g,"").trim();
    return result;
};

//轉科轉床(最近一次住院)
//changeBed:[{dateTime:"",bed:""}],changeSection:[{dateTime:"",section:""}]
Parser.getChangeBedSection=function(htmlText){
    var result={
        changeBed:[],
        changeSection:[]
    };
    var doc = Parser.getDOM(htmlText);
    var tbodyBed = Parser.searchDomByID(doc,'tbody_2');
    if(tbodyBed){
        var trs = tbodyBed.getElementsByTagName("tr");
        for(var i = 0; i < trs.length; i++){
            var tr=trs[i];
            var tds=tr.getElementsByTagName("td");
            var changeBed={dateTime:"",bed:""};
            changeBed.dateTime=Parser.getDateFromShortDate(tds[0].innerText.trim())+" "+Parser.getTimeFromShortTime(tds[1].innerText.trim());
            changeBed.bed=tds[2].innerText;
            result.changeBed.push(changeBed);
        }
    }

    var tbodySection = Parser.searchDomByID(doc,'tbody_3');
    if(tbodySection){
        var trs = tbodySection.getElementsByTagName("tr");
        for(var i = 0; i < trs.length; i++){
            var tr=trs[i];
            var tds=tr.getElementsByTagName("td");
            var changeSection={dateTime:"",bed:""};
            changeSection.dateTime=Parser.getDateFromShortDate(tds[0].innerText.trim())+" "+Parser.getTimeFromShortTime(tds[1].innerText.trim());
            changeSection.section=tds[2].innerText;
            result.changeSection.push(changeSection);
        }
    }
    return result;
};
//會診紀錄
//[{caseNo:"",oseq:"",bed:"",consultSection:"",consultDateTime:"",completeDateTime:"",status:"",doctors:""}]
Parser.getConsultation=function(htmlText){
    var resultArray=[];
    var doc = Parser.getDOM(htmlText);
    var tbody = doc.getElementsByTagName("tbody");
    tbody = tbody&&tbody[0];
    if(!tbody){return result;}
    var trs = tbody.getElementsByTagName("tr");
    for(var i = 0; i < trs.length; i++){
        var tr=trs[i];
        var tds=tr.getElementsByTagName("td");
        if(!tds){continue;}
        var result = {caseNo:"",oseq:"",bed:"",consultSection:"",consultDateTime:"",
            completeDateTime:"",status:"",doctors:""};
        result.caseNo=tds[0]&&tds[0].innerHTML.regSelectAll(/caseno=[0-9]{7,8}/g).replaceAll('caseno=','');
        result.oseq=tds[0]&&tds[0].innerHTML.regSelectAll(/oseq=[0-9]{4}/g).replaceAll('oseq=','');
        if(!result.oseq){continue;}
        result.bed=tds[2]&&tds[2].innerText.replaceAll(' ','');
        result.consultSection=tds[6]&&tds[6].innerText.replaceAll(' ','');
        result.consultDateTime=tds[7]&&Parser.getDateTimeFromShortDateTime(tds[7].innerText);
        result.completeDateTime=tds[8]&&Parser.getDateTimeFromShortDateTime(tds[8].innerText);
        result.status=tds[10]&&tds[10].innerHTML;
        result.doctors=tds[11]&&tds[11].innerText.replaceAll(' ','');
        resultArray.push(result);
    }
    return resultArray;
};
//會診回復(直加抓取含有<br>的htmlText)
Parser.getConsultationReply=function(htmlText){
    var doc = Parser.getDOM(htmlText);
    var tbody = doc.getElementsByTagName("tbody");
    tbody = tbody&&tbody[0];
    if(!tbody){return result;}
    var trs = tbody.getElementsByTagName("tr");
    var tds = trs[8].getElementsByTagName("td");
    var result = tds[1]&&tds[1].innerHTML;
    return result;
};
//尚未回覆會診
//[{bed:"",consultSection:"",consultDateTime:"",status:"",doctors:""}]
Parser.getConsultationPending=function(htmlText){
    var resultArray=[];
    var doc = Parser.getDOM(htmlText);
    var tbody = doc.getElementsByTagName("tbody");
    tbody = tbody&&tbody[0];
    if(!tbody){return resultArray;}
    var trs = tbody.getElementsByTagName("tr");
    if(!trs){return resultArray;}
    for(var i = 0 ; i< trs.length; i++)
    {
        var tr=trs[i];
        var tds=tr.getElementsByTagName("td");
        if(tds.length<12){continue;}
        var result= {bed:"",consultSection:"",consultDateTime:"",status:"",doctors:""}
        result.bed=tds[2].innerText.replaceAll(' ','');
        result.consultDateTime=Parser.getDateTimeFromShortDateTime(tds[6].innerText.trim());
        result.status=tds[9].innerText.trim();
        result.consultSection=tds[10].innerText.trim();
        result.doctors=tds[11].innerText.trim();
        resultArray.push(result);
    }
    return resultArray;
};
//手術
//[{date:"",surgeryName:"",doctor:{name:"",code:""}}] (**surgeryName:html String)
Parser.getSurgery=function(htmlText){
    var resultArray=[];
    var doc = Parser.getDOM(htmlText);
    var tbodies = doc.getElementsByTagName('tbody');
    if(!tbodies){return resultArray;}
    var tbody=tbodies[0];
    var trs = tbody.getElementsByTagName('tr');
    for(var i = 0 ; i<trs.length; i++){
        var tr=trs[i];
        if(!tr){continue;}
        var tds=tr.getElementsByTagName('td');
        if(tds.length<3){continue;}
        var result = {date:"",surgeryName:"",doctor:{name:"",code:""}};
        result.date=tds[0]&&tds[0].innerText;
        result.surgeryName=tds[1]&&tds[1].innerHTML;
        result.doctor.name=tds[2]&&tds[2].innerText.replace(tds[2].innerText.regSelectAll(/DOC[0-9]{4}[A-Z]{1}/g),'').trim();
        result.doctor.code=tds[2]&&tds[2].innerText.regSelectAll(/DOC[0-9]{4}[A-Z]{1}/g);
        resultArray.push(result);
    }
    return resultArray;
};
//查詢醫囑
//[{seq:"",dateTime:"",item:"",specimen:"",REQNO:"",unit:"",status:""}]
Parser.getOrder=function(htmlText){
    var resultArray=[];
    var doc = Parser.getDOM(htmlText);
    var tbodies = doc.getElementsByTagName('tbody');
    if(!tbodies){return resultArray;}
    var tbody=tbodies[0];
    var trs = tbody.getElementsByTagName('tr');
    for(var i = 0 ; i<trs.length; i++){
        var tr=trs[i];
        if(!tr){continue;}
        var tds=tr.getElementsByTagName('td');
        if(tds.length<8){continue;}
        var result ={seq:"",dateTime:"",item:"",specimen:"",req:"",unit:"",status:""};
        result.seq=tds[0]&&tds[0].innerText;
        result.item=tds[1]&&tds[1].innerText;
        result.specimen=tds[2]&&tds[2].innerText;
        result.req=tds[3]&&tds[3].innerText;
        result.unit=tds[4]&&tds[4].innerText;
        result.dateTime=tds[5]&&tds[5].innerText+" "+tds[6]&&tds[6].innerText;
        result.status=tds[7]&&tds[7].innerText;
        resultArray.push(result);
    }
    return resultArray;    
};
    //查詢醫囑
//[{seq:"",dateTime:"",item:"",specimen:"",REQNO:"",unit:"",status:""}]
Parser.getReport=function(htmlText){
    var resultArray=[];
    var doc = Parser.getDOM(htmlText);
    var tbodies = doc.getElementsByTagName('tbody');
    if(!tbodies){return resultArray;}
    var tbody=tbodies[0];
    var trs = tbody.getElementsByTagName('tr');
    for(var i = 0 ; i<trs.length; i++){
        var tr=trs[i];
        if(!tr){continue;}
        var tds=tr.getElementsByTagName('td');
        if(tds.length<7){continue;}
        var result ={partNo:"",patientID:"",caseNo:"",orderSeq:"",item:"",
            specimen:"",req:"",signDate:"",reportDate:""};
        var a = tds[0]&&tds[0].getElementsByTagName('a');
        if(!a){continue};
        a=a[0];
        var href=a.getAttribute('href');
        if(!href){continue};
        result.partNo=href.regSelectAll(/partno=[0-9]*/g).regReplaceAll('partno=','');
        result.patientID=href.regSelectAll(/histno=[0-9]*/g).regReplaceAll('histno=','');
        result.caseNo=href.regSelectAll(/caseno=[0-9]*/g).regReplaceAll('caseno=','');
        result.orderSeq=href.regSelectAll(/ordseq=[0-9]*/g).regReplaceAll('ordseq=','');
        result.item=a.innerText;
        result.specimen=tds[1]&&tds[1].innerText;
        result.req=tds[2]&&tds[2].innerText;
        result.signDate=tds[3]&&tds[3].innerText;
        result.reportDate=tds[4]&&tds[4].innerText;
        resultArray.push(result);
    }
    return resultArray;    
};
//查詢報告內容
//{htmlText:"",parsed:[{recieveDateTime:"",reportDateTime:"",key:"",value:""}]}
Parser.getReportContent=function(htmlText){
    var result={htmlText:"",parsed:[]};
    var doc = Parser.getDOM(htmlText);
    var pre = doc.getElementsByTagName('pre');
    if(!pre){return result;}
    pre=pre[0];
    result.htmlText=pre.innerText.regReplaceAll(/\\r\\n/g,"<br>");
    return result;
};
//查詢累積報告
//return {colNames:[], data:[]};
Parser.getCummulative=function(htmlText){
    var result={colNames:[], data:[]};
    var doc = Parser.getDOM(htmlText);
    var thead = doc.getElementsByTagName('thead');
    var tbody = doc.getElementsByTagName('tbody');
    if(!thead||!tbody||thead.length==0||tbody.length==0){return result;}
    thead=thead[0];
    var ths=thead.getElementsByTagName('th');
    for(var i = 0; i < ths.length;i++)
    {
        if(ths[i].innerText.trim()){
            result.colNames.push(ths[i].innerText.trim());
        }
    }
    tbody=tbody[0];
    var trs=tbody.getElementsByTagName('tr');
    for(var i = 0; i < trs.length-1;i++)
    {
        var tds =  trs[i].getElementsByTagName('td');
        if(tds.length < result.colNames.length){continue;}
        var newDataRow=[];
        for(var j = 0 ; j <result.colNames.length;j++)
        {
            var thisCol=tds[j].innerText.trim();
            if(thisCol=="-"){thisCol="";}
            newDataRow.push(thisCol);
        }
        if(result.colNames.indexOf('Glucose')<0){
            newDataRow[0]="20"+newDataRow[0];
        }
        newDataRow[0]=newDataRow[0].regReplaceAll(/\./,":");
        result.data.push(newDataRow);
    }
    return result;
}
//查詢生命徵象
//return {colNames:[], data:[]};
Parser.getVitalSign=function(htmlText){
    var result={colNames:[], data:[]};
    var doc = Parser.getDOM(htmlText);
    var thead = doc.getElementsByTagName('thead');
    var tbody = doc.getElementsByTagName('tbody');
    if(!thead||!tbody||thead.length==0||tbody.length==0){return result;}
    thead=thead[0];
    var ths=thead.getElementsByTagName('th');
    for(var i = 0; i < ths.length;i++)
    {
        result.colNames.push(ths[i].innerText.trim());
    }
    tbody=tbody[0];
    var trs=tbody.getElementsByTagName('tr');
    for(var i = 0; i < trs.length;i++)
    {
        var tds =  trs[i].getElementsByTagName('td');
        if(tds.length != result.colNames.length){continue;}
        var newDataRow=[];
        for(var j = 0 ; j <tds.length;j++)
        {
            var thisCol=tds[j].innerText.trim();
            newDataRow.push(thisCol);
        }
        newDataRow[0]=newDataRow[0].regReplaceAll(/\s\s+/g, ' ');
        if(result.colNames.indexOf('血氧濃度')>=0){
            var parts= newDataRow[0].split(' ');
            newDataRow[0]=Parser.getDateFromShortDate(parts[0])+" "+Parser.getTimeFromShortTime(parts[1])
        }
        result.data.push(newDataRow);
    }
    return result;
};