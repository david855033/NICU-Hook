"use strict";
var $flowsheetContent=$("#flow-sheet .content");
var $flowsheetContentTPR=$("#flow-sheet .content .tpr");
var $flowsheetHeader=$("#flow-sheet .header");
var $flowsheetFootBar=$("#flow-sheet .footbar");
var $flowsheetFootBarCard=$("#flow-sheet .footbarCard");
var $flowsheetFootbarFnButton=$('#flow-sheet .footbar-button');
var $flowsheetFootbarButton=$('#flow-sheet .button');
var $flowsheefFoot
var $window=$(window);

var Layout={};
Layout.footbar={};
Layout.footbar.mode='min';
Layout.footbar.FOOT_BAR_MAX_HEIGHT=600;
Layout.footbar.FOOT_BAR_MIN_HEIGHT=300;
Layout.footbar.FOOT_BAR_CLOSE_HEIGHT=40;
Layout.footbar.currentHeight = 300;

Layout.footbar.calculateHeight=function(height){
    var windowHeight=$window.height();
    console.log(windowHeight);

    var TPRHeight=$flowsheetContentTPR.height();
    console.log(TPRHeight);
};
Layout.footbar.max=function(){
    Layout.footbar.mode='max';
    Layout.footbar.modeSwitched()
};
Layout.footbar.min=function(){
    Layout.footbar.mode='min';
    Layout.footbar.modeSwitched()
};
Layout.footbar.close=function(){
    Layout.footbar.mode='close';
    Layout.footbar.modeSwitched()
};
Layout.footbar.modeSwitched=function(heigh){
    if(Layout.footbar.mode=='max')
    {
        Layout.footbar.setHeight(Layout.footbar.FOOT_BAR_MAX_HEIGHT);
    }else if(Layout.footbar.mode=='min')
    {
        Layout.footbar.setHeight(Layout.footbar.FOOT_BAR_MIN_HEIGHT);
    }else if(Layout.footbar.mode=='close')
    {
        Layout.footbar.setHeight(Layout.footbar.FOOT_BAR_CLOSE_HEIGHT);
    }
}
Layout.footbar.setHeight=function(height){
    Layout.footbar.currentHeight=height;
    $flowsheetFootBar.height(Layout.footbar.currentHeight);
    $flowsheetContent.height($window.height()-$flowsheetHeader.height()-20-Layout.footbar.currentHeight);
};
Layout.footbar.calculateCardWidth=function(){
    $flowsheetFootBarCard.width($flowsheetFootBar.width()/2-2);
};
Layout.footbar.calculateButtonPadding=function(){
    var buttonContainerWidth=$flowsheetFootBar.width();
    var totalWidth_FootbarButton=0;
    $flowsheetFootbarButton.each(function(){totalWidth_FootbarButton+=$(this).width();})
    var totalWidth_FootbarFnButton=0;
    $flowsheetFootbarFnButton.each(function(){totalWidth_FootbarFnButton+=$(this).width();})
    var remaining=buttonContainerWidth-totalWidth_FootbarButton-totalWidth_FootbarFnButton;

    var modifiedPadding =(remaining / 2 / $flowsheetFootbarFnButton.length);
    $flowsheetFootbarFnButton.css('padding-left',modifiedPadding);
    $flowsheetFootbarFnButton.css('padding-right',modifiedPadding);
}


$(function(){
    Layout.footbar.calculateHeight();
    Layout.footbar.min();
    Layout.footbar.calculateCardWidth();
    Layout.footbar.calculateButtonPadding();
});

$(window).resize(function(){
    Layout.footbar.calculateHeight();
    Layout.footbar.setHeight(Layout.footbar.currentHeight);
    Layout.footbar.calculateCardWidth();
    Layout.footbar.calculateButtonPadding();
});