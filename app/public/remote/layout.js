"use strict";
var $flowsheetContent=$("#flow-sheet .content");
var $flowsheetContentTPR=$("#flow-sheet .content .tpr");
var $flowsheetHeader=$("#flow-sheet .header");
var $flowsheetFootBar=$("#flow-sheet .footbar");
var $flowsheetFootBarCard=$("#flow-sheet .footbarCard");
var $flowsheetFootbarFnButton=$('#flow-sheet .footbar-button');
var $flowsheetFootbarButtons=$('#flow-sheet .buttons');
var $flowsheefFoot
var $window=$(window);

var Layout={};
Layout.footbar={};
Layout.footbar.mode='min';
Layout.footbar.FOOT_BAR_MAX_HEIGHT=600;
Layout.footbar.FOOT_BAR_MIN_HEIGHT=300;
Layout.footbar.FOOT_BAR_CLOSE_HEIGHT=40;


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
    var windowHeight=$window.height();
    var headerHeight=$flowsheetHeader.height();
    var TPRHeight= $flowsheetContentTPR.height();
    var contentRemaing = windowHeight-headerHeight-20;
    var remaining = windowHeight-headerHeight-TPRHeight-20;
    Layout.footbar.FOOT_BAR_MAX_HEIGHT =  d3.max([remaining,contentRemaing*0.6]);
    Layout.footbar.FOOT_BAR_MIN_HEIGHT =  d3.min([remaining,contentRemaing*0.4]);

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
    var totalWidth_FootbarButton=$flowsheetFootbarButtons.width();
    var totalWidth_FootbarFnButton=0;
    $flowsheetFootbarFnButton.each(function(){totalWidth_FootbarFnButton+=$(this).width();})
    var remaining=buttonContainerWidth-totalWidth_FootbarButton-totalWidth_FootbarFnButton;
    var modifiedPadding =((remaining-120) / 2 / $flowsheetFootbarFnButton.length);
    $flowsheetFootbarFnButton.css('padding-left',modifiedPadding);
    $flowsheetFootbarFnButton.css('padding-right',modifiedPadding);
}


$(function(){
    Layout.footbar.min();
    Layout.footbar.calculateCardWidth();
    Layout.footbar.calculateButtonPadding();
});

$(window).resize(function(){
    Layout.footbar.modeSwitched();
    Layout.footbar.calculateCardWidth();
    Layout.footbar.calculateButtonPadding();
});