var view= new Vue({
    el:'#view',
    data:{
        account:"",
        password:"",
        wardList:["NICU","PICU"],
        patientList:{content:[], timeStamp:""},
        admissionList:{content:[], timeStamp:""}
    },
    methods:{
        signIn:function(){
            server.signIn("DOC3924B","888888");
        },
        updatePatientList:function(ward){
            requestPatientList(ward,(data,timeStamp)=>{
                view.patientList.content = data;
                view.patientList.timeStamp = timeStamp;
            });
        },
        updateAdmissionList:function(patientID){
            console.log(patientID);
        }
    }
})