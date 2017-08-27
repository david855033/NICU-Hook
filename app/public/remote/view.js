var view= new Vue({
    el:'#view',
    data:{
        account:"",
        password:"",
        wardList:["NICU","PICU"],
        patientList:{content:[], timeStamp:""}
    },
    methods:{
        updatePatientList:function(ward){
            requestPatientList(ward,(data,timeStamp)=>{
                view.patientList.content = data;
                view.patientList.timeStamp = timeStamp;
            });
        }
    }
})