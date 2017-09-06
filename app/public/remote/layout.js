"use strict";
var $flowsheetContent=$("#flow-sheet #content");
var $flowsheetContentTPR=$("#flow-sheet #content .tpr");
var $flowsheetHeader=$("#flow-sheet #header");
var $flowsheetHeaderCards=$('#flow-sheet .header-card');
var $flowsheetFootBar=$("#flow-sheet #footbar");
var $flowsheetFootBarCard=$("#flow-sheet .footbarCard");
var $flowsheetFootbarFnButton=$('#flow-sheet .footbar-fn-button');
var $flowsheetFootbarButtons=$('#flow-sheet #footbar-toggle-buttons');
var $flowsheetFootbarSubs=$('#flow-sheet .footbar-sub');
var $window=$(window);

var Layout={};
Layout.header={};
Layout.header.calculateCardPadding=function(){
    var headerWidth=$flowsheetHeader.width();
    var cardsWidth=0;
    $flowsheetHeaderCards.each(function(){
        cardsWidth+=$(this).width();
    });
    var padding=(headerWidth-cardsWidth)/$flowsheetHeaderCards.length/2-4;
    $flowsheetHeaderCards.css('padding-left',padding);
    $flowsheetHeaderCards.css('padding-right',padding);
}


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
Layout.footbar.modeSwitched=function(){
    var windowHeight=$window.height();
    var headerHeight=$flowsheetHeader.height();
    var TPRHeight= $flowsheetContentTPR.height();
    var contentRemaing = windowHeight-headerHeight-20;
    var remaining = windowHeight-headerHeight-TPRHeight-40;
    Layout.footbar.FOOT_BAR_MAX_HEIGHT =  450;//d3.max([remaining,contentRemaing*0.7]);
    Layout.footbar.FOOT_BAR_MIN_HEIGHT =  300;//d3.min([remaining,contentRemaing*0.5]);

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
    $flowsheetFootbarSubs.height(Layout.footbar.currentHeight-50);
    $flowsheetContent.height($window.height()-$flowsheetHeader.height()-25-Layout.footbar.currentHeight);
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
    var modifiedPadding =((remaining) / 2 / $flowsheetFootbarFnButton.length);
    $flowsheetFootbarFnButton.css('padding-left',modifiedPadding);
    $flowsheetFootbarFnButton.css('padding-right',modifiedPadding);
}


$(function(){
    Layout.footbar.min();
    Layout.footbar.calculateCardWidth();
    Layout.footbar.calculateButtonPadding();
    Layout.header.calculateCardPadding();
    $('.scrollbar-inner').scrollbar();
    $('.scrollbar-outer').scrollbar();
});

$(window).resize(function(){
    Layout.footbar.modeSwitched();
    Layout.footbar.calculateCardWidth();
    Layout.footbar.calculateButtonPadding();
    Layout.header.calculateCardPadding();
});


    