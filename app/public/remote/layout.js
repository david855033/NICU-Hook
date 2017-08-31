"use strict";
var $flowsheetContent=$("#flow-sheet .content");
var $flowsheetHeader=$("#flow-sheet .header");
var $flowsheetFootBar=$("#flow-sheet .footbar");
var $flowsheetFootBarCard=$("#flow-sheet .footbarCard");
var $window=$(window);

var Layout={};
Layout.footbar={};
Layout.footbar.FOOT_BAR_MAX_HEIGHT=400;
Layout.footbar.FOOT_BAR_MIN_HEIGHT=240;
Layout.footbar.FOOT_BAR_CLOSE_HEIGHT=40;
Layout.footbar.currentHeight = 240;
Layout.footbar.max=function(){
    Layout.footbar.setHeight(Layout.footbar.FOOT_BAR_MAX_HEIGHT);
};
Layout.footbar.min=function(){
    Layout.footbar.setHeight(Layout.footbar.FOOT_BAR_MIN_HEIGHT);
};
Layout.footbar.close=function(){
    Layout.footbar.setHeight(Layout.footbar.FOOT_BAR_CLOSE_HEIGHT);
};
Layout.footbar.setHeight=function(height){
    Layout.footbar.currentHeight=height;
    $flowsheetFootBar.height(Layout.footbar.currentHeight);
    $flowsheetContent.height($window.height()-$flowsheetHeader.height()-20-Layout.footbar.currentHeight);
};
Layout.footbar.calculateCardWidth=function(){
    $flowsheetFootBarCard.width($flowsheetFootBar.width()/2-2);
};


$(function(){
    Layout.footbar.min();
    Layout.footbar.calculateCardWidth();
});

$(window).resize(function(){
    Layout.footbar.setHeight(Layout.footbar.currentHeight);
    Layout.footbar.calculateCardWidth();
});