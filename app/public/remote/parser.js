;'use strict';
var Parser={
    getDOM:function(htmlText){
        var doc = document.implementation.createHTMLDocument("example");
        doc.documentElement.innerHTML = htmlText;
        return doc;
    }
}