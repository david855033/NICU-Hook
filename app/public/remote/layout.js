"use strict";
var $flowsheetContent=$("#flow-sheet #content");
var $flowsheetContentTPR=$("#flow-sheet #content .chart");
var $flowsheetHeader=$("#flow-sheet #header");
var $flowsheetHeaderCards=$('#flow-sheet .header-card');
var $flowsheetFootBar=$("#flow-sheet #footbar");
var $flowsheetFootBarCard=$("#flow-sheet .footbarCard");
var $flowsheetFootbarFnButton=$('#flow-sheet .footbar-fn-button');
var $flowsheetFootbarButtons=$('#flow-sheet #footbar-toggle-buttons');
var $flowsheetFootbarSubs=$('#flow-sheet .footbar-sub');
var $flowsheetFootbarScrolls=$("#flow-sheet #footbar .scrollbar-outer");
var $window=$(window);

var Layout={};

Layout.left={};
Layout.left.initialize=function(){
    $('#left #query-type').click(function(){
        $('#left #query-box input').focus();
        view.queryString="";
        view.queryClass="";
        view.queryType="查詢";
    })
}



Layout.header={};
Layout.header.calculateCardPadding=function(){
    var $flowsheetHeaderCards=$('#flow-sheet .header-card');
    var headerWidth=$flowsheetHeader.width();
    var cardsWidth=0;
    $flowsheetHeaderCards.each(function(){
        cardsWidth+=$(this).width();
    });
    var padding=(headerWidth-cardsWidth)/$flowsheetHeaderCards.length/2-4;
    $flowsheetHeaderCards.css('padding-left',padding);
    $flowsheetHeaderCards.css('padding-right',padding);
}
Layout.header.setCardFunctionPosition=function(){
    $("#datepicker").css('left',$("#datepicker-card").position().left);
    $("#adpicker").css('left',$("#admission-card").position().left);
    $("#bw").css('left',$("#bw-card").position().left);
}


Layout.footbar={};
Layout.footbar.mode='min';
Layout.footbar.FOOT_BAR_MAX_HEIGHT=450;
Layout.footbar.FOOT_BAR_MIN_HEIGHT=300;
Layout.footbar.FOOT_BAR_CLOSE_HEIGHT=30; //fnButton height

Layout.footbar.max=function(){
    Layout.footbar.mode='max';
    Layout.footbar.modeSwitched();
    setTimeout(function() {
        Layout.footbar.scrollDown();
    }, 500);
};
Layout.footbar.min=function(){
    Layout.footbar.mode='min';
    Layout.footbar.modeSwitched();
    setTimeout(function() {
        Layout.footbar.scrollDown();
    }, 500);
};
Layout.footbar.close=function(){
    Layout.footbar.mode='close';
    Layout.footbar.modeSwitched();
};
Layout.footbar.modeSwitched=function(){
    var windowHeight=$window.height();
    var headerHeight=$flowsheetHeader.height();
    var TPRHeight= $flowsheetContentTPR.height();

    Layout.footbar.FOOT_BAR_MAX_HEIGHT =  450;
    Layout.footbar.FOOT_BAR_MIN_HEIGHT =  300;

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
    $flowsheetFootbarSubs.height(Layout.footbar.currentHeight-40);
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
    var modifiedPadding =((remaining) / 2 / $flowsheetFootbarFnButton.length);
    $flowsheetFootbarFnButton.css('padding-left',modifiedPadding);
    $flowsheetFootbarFnButton.css('padding-right',modifiedPadding);
}

Layout.footbar.scrollDown=function(){
    $flowsheetFootbarScrolls.animate({ scrollTop: $flowsheetFootbarScrolls.prop("scrollHeight")}, 300);
}

Layout.onWidthChange=function(){
    Layout.header.calculateCardPadding();
    Layout.footbar.calculateCardWidth();
    Layout.footbar.calculateButtonPadding();
    Layout.footbar.scrollDown();
    Layout.header.setCardFunctionPosition();
}

$(function(){
    viewRender.initialize();
    Layout.left.initialize();
});

$(window).resize(function(){
    Layout.footbar.modeSwitched();
    Layout.onWidthChange();
});

