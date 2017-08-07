;'use strict';
var Parser={
    getBodyContent:function(htmlText){
        var parsedString=htmlText.match(/<body>[\s\S]*<\/body>/);
        var resultString="";
        if(parsedString){
            resultString=parsedString[0];
            resultString=resultString.replace('<body>','');
            resultString=resultString.replace('</body>','');
        }
        return resultString;
    }
}