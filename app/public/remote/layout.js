"use strict";
var $flowsheetContent=$("#flow-sheet .content");
var $flowsheetHeader=$("#flow-sheet .header");
var $flowsheetFootBar=$("#flow-sheet .footBar");
var $window=$(window);

$(function(){
    setTPRHeight();
    setFootbarHeight(300);
});
$(window).resize(function(){
    setTPRHeight();
});

var setTPRHeight=function(){
    $flowsheetContent.height($window.height()-$flowsheetHeader.height()-20-$flowsheetFootBar.height());
};

var setFootbarHeight=function(height){
     $flowsheetFootBar.height(height);
     setTPRHeight();
}