$(()=>{
});

var dev = new Vue({
    el: '#dev',
    data:{
        content:"",
        cookie:"",
    },
    methods:{
        signIn:function(){
            server.signIn();
        },
        clearCookie:function(){
            server.cookie.string="";
        },
        get:function(){
            var url="https://web9.vghtpe.gov.tw/emr/qemr/qemr.cfm?action=findPatient";
            server.get(url);
        }
    }
});