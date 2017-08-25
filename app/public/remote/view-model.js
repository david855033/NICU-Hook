$(()=>{
});

var view= new Vue({
    el:'#view',
    data:{
        account:"",
        password:""
    },
    methods:{
        
    }
})

var dev = new Vue({
    el: '#dev',
    data:{
        showDev:true,
        cookie:{
            str:"",
            dateTime:"",
        },
        data:{
            dateTime:"",
            content:""
        }
    },
    methods:{
        signIn:function(){
            server.signIn("DOC3924B","888888");
        },
        get:function(){
            var url="https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findPatient";
            server.get(url,(resBody,timeStamp)=>{this.data.dateTime=timeStamp;this.data.content=resBody;});
        },
        getPT:function(){
            var url = "https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findEmr&histno=43977748&caseno=22477040&ward=NICU#";
            server.get(url,(resBody,timeStamp)=>{this.data.dateTime=timeStamp;this.data.content=resBody;});
        },
        getNIS:function(){
            var url = "https://web9.vghtpe.gov.tw/NIS/nicuflowsheet.jsp?hisid=43977748&caseno=22477040";
            server.get(url,(resBody,timeStamp)=>{this.data.dateTime=timeStamp;this.data.content=resBody;});
        },
        getNIS2:function(){
            var url = "https://web9.vghtpe.gov.tw/NIS/report/FlowSheet/main.do?gaugeDate1=20170825&r_ser_num=22477040&r_his_id=43977748";
            server.get(url,(resBody,timeStamp)=>{this.data.dateTime=timeStamp;this.data.content=resBody;});
        },
    }
});