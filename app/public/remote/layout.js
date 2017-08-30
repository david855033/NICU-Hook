"use strict";
var $flowsheetContent=$("#flow-sheet .content");
var $flowsheetHeader=$("#flow-sheet .header");
var $flowsheetFootBar=$("#flow-sheet .footBar");
var $flowsheetFootBarCard=$("#flow-sheet .footBarCard");
var $window=$(window);

var Layout={};
Layout.footBar={};
Layout.footBar.FOOT_BAR_MAX_HEIGHT=240;
Layout.footBar.FOOT_BAR_MIN_HEIGHT=40;
Layout.footBar.currentHeight = 240;
Layout.footBar.open=function(){
    Layout.footBar.setHeight(Layout.footBar.FOOT_BAR_MAX_HEIGHT);
};
Layout.footBar.close=function(){
    Layout.footBar.setHeight(Layout.footBar.FOOT_BAR_MIN_HEIGHT);
};
Layout.footBar.setHeight=function(height){
    Layout.footBar.currentHeight=height;
    $flowsheetFootBar.height(Layout.footBar.currentHeight);
    $flowsheetContent.height($window.height()-$flowsheetHeader.height()-20-Layout.footBar.currentHeight);
};
Layout.footBar.calculateCardWidth=function(){
    $flowsheetFootBarCard.width($flowsheetFootBar.width()/2-2);
};


$(function(){
    Layout.footBar.open();
    Layout.footBar.calculateCardWidth();
});

$(window).resize(function(){
    Layout.footBar.setHeight(Layout.footBar.currentHeight);
    Layout.footBar.calculateCardWidth();
});