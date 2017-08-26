var view= new Vue({
    el:'#view',
    data:{
        account:"",
        password:"",
        testData:{content:"Initial Data",timeStamp:Parser.getDateTime()}
    },
    methods:{
        updateData:function(){
            requestView((data,timeStamp)=>{
                view.testData.content = data;
                view.testData.timeStamp = timeStamp;
            });
        }
    }
})